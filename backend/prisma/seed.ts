import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai Seeding Database...');

  // --- 1. SEED USERS ---
  const password = await bcrypt.hash('123456', 10);
  const users = [
    { username: 'superadmin', role: Role.ADMIN_PUSAT, regionCode: null },
    { username: 'admin_prov', role: Role.ADMIN_PROVINSI, regionCode: '31' },
    { username: 'admin_kab', role: Role.ADMIN_KABUPATEN, regionCode: '3175' },
    { username: 'admin_kec', role: Role.ADMIN_KECAMATAN, regionCode: '317506' },
    { username: 'admin_kel', role: Role.ADMIN_KELURAHAN, regionCode: '3175061005' },
  ];

  console.log('Creating Users...');
  for (const u of users) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: { password: password, role: u.role, regionCode: u.regionCode },
      create: {
        username: u.username,
        password: password,
        role: u.role,
        regionCode: u.regionCode,
      },
    });
  }


  const regions = [
 
    { code: '31', name: 'DKI JAKARTA', level: 'PROVINSI', parentCode: null },
    { code: '32', name: 'JAWA BARAT', level: 'PROVINSI', parentCode: null },
    { code: '33', name: 'JAWA TENGAH', level: 'PROVINSI', parentCode: null },
    { code: '34', name: 'DI YOGYAKARTA', level: 'PROVINSI', parentCode: null },
    { code: '35', name: 'JAWA TIMUR', level: 'PROVINSI', parentCode: null },

   
    { code: '3171', name: 'JAKARTA PUSAT', level: 'KABUPATEN', parentCode: '31' },
    { code: '3172', name: 'JAKARTA UTARA', level: 'KABUPATEN', parentCode: '31' },
    { code: '3173', name: 'JAKARTA BARAT', level: 'KABUPATEN', parentCode: '31' },
    { code: '3174', name: 'JAKARTA SELATAN', level: 'KABUPATEN', parentCode: '31' },
    { code: '3175', name: 'JAKARTA TIMUR', level: 'KABUPATEN', parentCode: '31' },

    { code: '317505', name: 'DUREN SAWIT', level: 'KECAMATAN', parentCode: '3175' },
    { code: '317502', name: 'PULOGADUNG', level: 'KECAMATAN', parentCode: '3175' },
    { code: '317503', name: 'JATINEGARA', level: 'KECAMATAN', parentCode: '3175' },
    { code: '317504', name: 'KRAMATJATI', level: 'KECAMATAN', parentCode: '3175' },
    { code: '317506', name: 'CAKUNG', level: 'KECAMATAN', parentCode: '3175' },


    { code: '3175051001', name: 'PONDOK BAMBU', level: 'KELURAHAN', parentCode: '317505' },
    { code: '3175051002', name: 'PONDOK KELAPA', level: 'KELURAHAN', parentCode: '317505' },
    { code: '3175051003', name: 'PONDOK KOPI', level: 'KELURAHAN', parentCode: '317505' },
    { code: '3175051004', name: 'KLENDER', level: 'KELURAHAN', parentCode: '317505' },
    { code: '3175051005', name: 'PENGGILINGAN', level: 'KELURAHAN', parentCode: '317505' },
  ];
  

  console.log('Seeding Regions...');
  
  for (const r of regions) {
    await prisma.region.upsert({
      where: { code: r.code },
      update: {},
      create: r,
    });
  }

  console.log('✅ Seeding Selesai.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());