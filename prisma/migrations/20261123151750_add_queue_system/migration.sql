-- CreateEnum
CREATE TYPE "QueueTokenStatus" AS ENUM ('WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'SKIPPED');

-- CreateTable
CREATE TABLE "QueueSession" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "lastTokenNumber" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueueSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueToken" (
    "id" TEXT NOT NULL,
    "tokenNumber" INTEGER NOT NULL,
    "status" "QueueTokenStatus" NOT NULL DEFAULT 'WAITING',
    "sessionId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueueToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QueueSession_businessId_date_idx" ON "QueueSession"("businessId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "QueueSession_businessId_date_key" ON "QueueSession"("businessId", "date");

-- CreateIndex
CREATE INDEX "QueueToken_sessionId_status_idx" ON "QueueToken"("sessionId", "status");

-- CreateIndex
CREATE INDEX "QueueToken_customerId_idx" ON "QueueToken"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "QueueToken_sessionId_tokenNumber_key" ON "QueueToken"("sessionId", "tokenNumber");

-- CreateIndex
CREATE UNIQUE INDEX "QueueToken_sessionId_customerId_key" ON "QueueToken"("sessionId", "customerId");

-- AddForeignKey
ALTER TABLE "QueueSession" ADD CONSTRAINT "QueueSession_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueToken" ADD CONSTRAINT "QueueToken_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "QueueSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueToken" ADD CONSTRAINT "QueueToken_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueToken" ADD CONSTRAINT "QueueToken_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
