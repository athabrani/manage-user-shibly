import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getRegions = async (req: Request, res: Response) => {
  try {
    const { parentCode } = req.query;

    let whereClause: any = {};

    if (!parentCode) {
      whereClause = {
        OR: [
            { parentCode: null },
            { parentCode: "" }
        ]
      };
    } else {
      whereClause = { parentCode: String(parentCode) };
    }

    const regions = await prisma.region.findMany({
      where: whereClause,
      orderBy: { name: 'asc' } 
    });

    res.json(regions);
  } catch (error) {
    console.error("Error fetching regions:", error);
    res.status(500).json({ message: "Gagal memuat data wilayah" });
  }
};