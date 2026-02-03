import type { Response } from 'express';
import { prisma } from '../../config/db.ts';
import type { AuthRequest } from '../auth/auth.middleware.ts';
import { getRegionFilter } from '../members/member.service.ts';
import * as xlsx from 'xlsx';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  
  const where = getRegionFilter(req.user);


  console.log("=== DEBUG DASHBOARD STATS ===");
  console.log("User Login ID:", req.user.id, "| Role:", req.user.role);
  console.log("Filter (Where Clause):", JSON.stringify(where, null, 2));
  
  const total = await prisma.member.count({ where });
  console.log("Total ditemukan di DB:", total);


  const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
  const today = await prisma.member.count({ where: { ...where, createdAt: { gte: startOfDay } } });


  const now = new Date();
  const thirtyMinsAgo = new Date(now.getTime() - 30 * 60000);

  const recentData = await prisma.member.findMany({
    where: { ...where, createdAt: { gte: thirtyMinsAgo } },
    select: { createdAt: true }
  });

  const graph = [];
  for (let i = 0; i < 6; i++) {
    const start = new Date(thirtyMinsAgo.getTime() + i * 5 * 60000);
    const end = new Date(start.getTime() + 5 * 60000);
    const count = recentData.filter((m: { createdAt: Date }) => m.createdAt >= start && m.createdAt < end).length;
    graph.push({ time: end.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), count });
  }


  const latestMembers = await prisma.member.findMany({
    where,
    take: 5, // Ambil 5 saja
    orderBy: { createdAt: 'desc' }, 
    select: {
      ktp: true,
      name: true,
      phone: true,
      fullAddress: true, 
      createdAt: true
    }
  });

  return res.json({ total, today, graph, latestMembers });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRecap = async (req: AuthRequest, res: Response) => {
  try {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  // 1. FILTER OTOMATIS SESUAI TINGKATAN (Pusat/Prov/Kab/Kec)
  // Ini yang menjamin Admin Jabar cuma bisa download data Jabar
  const where = getRegionFilter(req.user); 
  const { role } = req.user;
  
  // 2. Tangkap Parameter Export
  // Pastikan nama parameternya 'export' (sama dengan frontend)
  const isExport = req.query.export === 'true';

  // 3. Tentukan Grouping (Level Anak)
  let groupByField: any = ''; 
  let childLevelName = 'Wilayah';

  switch (role) {
    case 'ADMIN_PUSAT':     groupByField = 'provinceCode'; childLevelName = 'Provinsi'; break;
    case 'ADMIN_PROVINSI':  groupByField = 'regencyCode';  childLevelName = 'Kabupaten/Kota'; break;
    case 'ADMIN_KABUPATEN': groupByField = 'districtCode'; childLevelName = 'Kecamatan'; break;
    case 'ADMIN_KECAMATAN': groupByField = 'villageCode';  childLevelName = 'Kelurahan'; break;
    case 'ADMIN_KELURAHAN': return res.json({ data: [], mode: 'list' }); // Kelurahan tidak butuh rekap
    default: return res.status(400).json({ message: "Role tidak valid untuk rekapitulasi" });
  }

  // 4. Query Database (Hitung Jumlah)
  const groups = await prisma.member.groupBy({
    by: [groupByField],
    where, // <--- Filter ini kuncinya!
    _count: { _all: true },
  });

  // 5. Ambil Data Detail Wilayah (Termasuk Induknya)
  const codes = groups.map((g: any) => g[groupByField]);
  const regions = await prisma.region.findMany({
    where: { code: { in: codes } },
    include: { parent: { include: { parent: { include: { parent: true } } } } } // Ambil hierarki ke atas
  });

  // 6. Format Data
  const formattedData = groups.map((g: any) => {
    const code = g[groupByField];
    const region = regions.find(r => r.code === code);
    
    // Logic Hierarki String (misal: "Cakung, Jakarta Timur")
    let hierarchy = '-';
    if (region && region.parent) {
       const parts = [region.parent.name];
       if (region.parent.parent) {
          parts.push(region.parent.parent.name);
          if (region.parent.parent.parent) parts.push(region.parent.parent.parent.name);
       }
       hierarchy = parts.join(', ');
    } else {
       hierarchy = 'Tingkat Provinsi';
    }

    return {
      code,
      name: region ? region.name : `Kode ${code}`,
      hierarchy,
      total: g._count._all
    };
  });



  if (isExport) {
     const wb = xlsx.utils.book_new();
     
     const excelData = formattedData.map(d => ({
         "Kode": d.code,
         [`Nama ${childLevelName}`]: d.name, // Header Dinamis
         "Induk Wilayah": d.hierarchy,
         "Total Anggota": d.total
     }));
     
     const ws = xlsx.utils.json_to_sheet(excelData);
     // Auto width kolom agar rapi
     ws['!cols'] = [{wch:15}, {wch:30}, {wch:40}, {wch:15}];

     xlsx.utils.book_append_sheet(wb, ws, "Rekapitulasi");
     
     const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
     
     // Set Header Download
     res.setHeader('Content-Disposition', `attachment; filename="Rekap_${childLevelName}.xlsx"`);
     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
     
     return res.send(buf);
  }

  // Return JSON biasa untuk Frontend Table
  return res.json({ data: formattedData, mode: 'recap', levelName: childLevelName });
  } catch (error) {
    console.error("Error in getRecap:", error);
    return res.status(500).json({ message: "Gagal mengambil data rekapitulasi" });
  }
};
