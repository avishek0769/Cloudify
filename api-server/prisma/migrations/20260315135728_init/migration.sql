-- CreateTable
CREATE TABLE "Log_Events" (
    "id" TEXT NOT NULL,
    "log" TEXT NOT NULL,
    "deploymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_Events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Log_Events_id_key" ON "Log_Events"("id");

-- AddForeignKey
ALTER TABLE "Log_Events" ADD CONSTRAINT "Log_Events_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
