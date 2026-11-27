-- CreateTable
CREATE TABLE "RepairJobCounter" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "lastJobNumber" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairJobCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepairJobCounter_businessId_key" ON "RepairJobCounter"("businessId");

-- AddForeignKey
ALTER TABLE "RepairJobCounter" ADD CONSTRAINT "RepairJobCounter_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
