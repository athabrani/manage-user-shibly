import type { Request, Response } from 'express';
import { prisma } from '../../config/db.ts';
import type { AuthRequest } from '../auth/auth.middleware.ts';
import { getRegionFilter } from './member.service.ts';
import * as xlsx from 'xlsx';

// Public: Pendaftaran
export const registerMember = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    // Validasi sederhana
    if (data.ktp.length !== 16) throw new Error("KTP must be 16 digits");

    const member = await prisma.member.create({ data });
    res.status(201).json(member);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
};

// Private: List Member (Khusus Admin Kelurahan atau Drill-down)
export const getMembers = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  // 1. FILTER WILAYAH OTOMATIS
  // Admin Pusat = {}, Admin Jabar = {provinceCode: '32'}, dst.
  const where = getRegionFilter(req.user); 
  
  // 2. Cek Export
  const page = parseInt(req.query.page as string) || 1;
  const isExport = req.query.export === 'true';

  // Jika Export -> Ambil SEMUA (undefined). Jika Table -> Ambil 10.
  const take = isExport ? undefined : 10;
  const skip = isExport ? undefined : (page - 1) * 10;

  try {
    // 3. Query Database
    const members = await prisma.member.findMany({
      where, // <--- Filter otomatis bekerja di sini
      ...(take !== undefined ? { take } : {}),
      ...(skip !== undefined ? { skip } : {}),
      orderBy: { createdAt: 'desc' },
    });
    
    // 4. Lookup Nama Wilayah (Batch Query biar cepat)
    const regionCodes = new Set<string>();
    members.forEach(m => {
      if(m.provinceCode) regionCodes.add(m.provinceCode);
      if(m.regencyCode) regionCodes.add(m.regencyCode);
      if(m.districtCode) regionCodes.add(m.districtCode);
      if(m.villageCode) regionCodes.add(m.villageCode);
    });

    const regions = await prisma.region.findMany({
      where: { code: { in: Array.from(regionCodes) } }
    });
    const regionMap = new Map(regions.map(r => [r.code, r.name]));

    // 5. Gabungkan Data
    const enrichedMembers = members.map(m => ({
      ...m,
      provinceName: regionMap.get(m.provinceCode) || '-',
      regencyName: regionMap.get(m.regencyCode) || '-',
      districtName: regionMap.get(m.districtCode) || '-',
      villageName: regionMap.get(m.villageCode) || '-',
    }));

  
    if (isExport) {
        const wb = xlsx.utils.book_new();

     
        const excelData = enrichedMembers.map((m, idx) => ({
            "No": idx + 1,
            "Nama Lengkap": m.name,
            "No KTP": m.ktp,
            "No HP": m.phone,
            "Provinsi": m.provinceName,
            "Kab/Kota": m.regencyName,
            "Kecamatan": m.districtName,
            "Kelurahan": m.villageName,
            "Alamat Lengkap": (m as any).fullAddress || '-',
            "Tgl Daftar": new Date(m.createdAt).toLocaleDateString('id-ID')
        }));

        const ws = xlsx.utils.json_to_sheet(excelData);
        // Atur lebar kolom
        ws['!cols'] = [
            {wch: 5}, {wch: 25}, {wch: 20}, {wch: 15}, 
            {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, 
            {wch: 40}, {wch: 15}
        ];

        xlsx.utils.book_append_sheet(wb, ws, "Data Anggota");
        
        const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
        
        const filename = `Data_Anggota_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        
        return res.send(buf);
    }

    // Return JSON Normal (Pagination)
    const total = await prisma.member.count({ where });
    return res.json({ 
      data: enrichedMembers, 
      total, 
      currentPage: page,
      totalPages: Math.ceil(total / (take || 10)) 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Gagal mengambil data" });
  }
};