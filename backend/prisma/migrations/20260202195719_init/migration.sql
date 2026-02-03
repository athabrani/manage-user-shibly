-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN_PUSAT', 'ADMIN_PROVINSI', 'ADMIN_KABUPATEN', 'ADMIN_KECAMATAN', 'ADMIN_KELURAHAN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "regionCode" TEXT,
    "regionName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "ktp" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "provinceCode" TEXT NOT NULL,
    "regencyCode" TEXT NOT NULL,
    "districtCode" TEXT NOT NULL,
    "villageCode" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("ktp")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Member_ktp_key" ON "Member"("ktp");

-- CreateIndex
CREATE UNIQUE INDEX "Member_phone_key" ON "Member"("phone");
