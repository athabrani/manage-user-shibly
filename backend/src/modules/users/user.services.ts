import { PrismaClient, type User } from '@prisma/client';
import { hashPassword } from '../../utils/hash.ts';

const prisma = new PrismaClient();

export const createUserService = async (data: any) => {
  const hashedPassword = await hashPassword(data.password);
  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};

export const getAllUsersService = async () => {
  return prisma.user.findMany({
    select: { id: true, username: true, role: true, regionCode: true, createdAt: true } // Exclude password
  });
};

export const updateUserService = async (id: number, data: any) => {
  const updateData: any = {
    username: data.username,
    role: data.role,
    regionCode: data.regionCode,
  };

  // Hanya update password jika dikirim (tidak kosong)
  if (data.password && data.password.trim() !== "") {
    updateData.password = await hashPassword(data.password);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
  });
};

export const deleteUserService = async (id: number) => {
  return prisma.user.delete({ where: { id } });
};