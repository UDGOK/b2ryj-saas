-- AlterTable
ALTER TABLE "MaintenanceRequest" ALTER COLUMN "title" SET DEFAULT 'Untitled',
ALTER COLUMN "priority" SET DEFAULT 'LOW';

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "type" SET DEFAULT 'RENT';

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "bathrooms" SET DEFAULT 1,
ALTER COLUMN "bedrooms" SET DEFAULT 1,
ALTER COLUMN "rent" SET DEFAULT 0,
ALTER COLUMN "type" SET DEFAULT 'APARTMENT';
