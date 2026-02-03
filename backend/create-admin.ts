import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Kita akan membuat password "123456" tapi di-hash
  const saltRounds = 10;
  const rawPassword = '123456'; 
  const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

  console.log(`Password asli: ${rawPassword}`);
  console.log(`Password hash: ${hashedPassword}`);

  // 2. Simpan ke database
  const user = await prisma.user.upsert({
    where: { username: 'superadmin' }, // Kita pakai username baru biar tidak bentrok
    update: {
      password: hashedPassword, // Update password jika user sudah ada
    },
    create: {
      username: 'superadmin',
      password: hashedPassword, // Simpan versi hash, BUKAN raw
      role: 'ADMIN_PUSAT',
      regionCode: '00', // Contoh region code
    },
  });

  console.log('✅ User berhasil dibuat/diupdate:');
  console.log(user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });