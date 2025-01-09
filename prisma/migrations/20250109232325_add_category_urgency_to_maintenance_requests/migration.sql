-- CreateEnum
CREATE TYPE "RequestCategory" AS ENUM ('PLUMBING', 'ELECTRICAL', 'STRUCTURAL', 'APPLIANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "RequestUrgency" AS ENUM ('NORMAL', 'URGENT');

-- AlterTable
ALTER TABLE "MaintenanceRequest" ADD COLUMN     "category" "RequestCategory" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "urgency" "RequestUrgency" NOT NULL DEFAULT 'NORMAL';

-- AlterTable
ALTER TABLE "_PropertyManager" ADD CONSTRAINT "_PropertyManager_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PropertyManager_AB_unique";

-- AlterTable
ALTER TABLE "_TenantLeases" ADD CONSTRAINT "_TenantLeases_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_TenantLeases_AB_unique";
