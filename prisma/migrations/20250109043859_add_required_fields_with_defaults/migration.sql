-- Add default values for MaintenanceRequest table
ALTER TABLE "MaintenanceRequest" ADD COLUMN "propertyId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "MaintenanceRequest" ADD COLUMN "requesterId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "MaintenanceRequest" ADD COLUMN "title" TEXT NOT NULL DEFAULT 'Untitled';
ALTER TABLE "MaintenanceRequest" ALTER COLUMN "priority" TYPE TEXT USING priority::TEXT;
UPDATE "MaintenanceRequest" SET "priority" = 'LOW' WHERE "priority" IS NULL;
ALTER TABLE "MaintenanceRequest" ALTER COLUMN "priority" SET NOT NULL;

-- Add default value for Payment table
ALTER TABLE "Payment" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'RENT';

-- Add default values for Property table
ALTER TABLE "Property" ADD COLUMN "bathrooms" FLOAT NOT NULL DEFAULT 1;
ALTER TABLE "Property" ADD COLUMN "bedrooms" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Property" ADD COLUMN "rent" FLOAT NOT NULL DEFAULT 0;
ALTER TABLE "Property" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'APARTMENT';

-- Add any other necessary changes from your schema update

