-- CreateEnum
CREATE TYPE "RepairJobStatus" AS ENUM ('RECEIVED', 'DIAGNOSING', 'IN_REPAIR', 'READY_FOR_PICKUP', 'COLLECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "RepairJob" (
    "id" TEXT NOT NULL,
    "jobNumber" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "status" "RepairJobStatus" NOT NULL DEFAULT 'RECEIVED',
    "estimatedCost" DOUBLE PRECISION,
    "finalCost" DOUBLE PRECISION,
    "customerId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "serviceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RepairJob_customerId_idx" ON "RepairJob"("customerId");

-- CreateIndex
CREATE INDEX "RepairJob_businessId_status_idx" ON "RepairJob"("businessId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RepairJob_businessId_jobNumber_key" ON "RepairJob"("businessId", "jobNumber");

-- AddForeignKey
ALTER TABLE "RepairJob" ADD CONSTRAINT "RepairJob_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairJob" ADD CONSTRAINT "RepairJob_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairJob" ADD CONSTRAINT "RepairJob_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
