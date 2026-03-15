/*
  Warnings:

  - You are about to drop the column `deploymentId` on the `Log_Events` table. All the data in the column will be lost.
  - Added the required column `deployment_id` to the `Log_Events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Log_Events" DROP CONSTRAINT "Log_Events_deploymentId_fkey";

-- AlterTable
ALTER TABLE "Log_Events" DROP COLUMN "deploymentId",
ADD COLUMN     "deployment_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Log_Events" ADD CONSTRAINT "Log_Events_deployment_id_fkey" FOREIGN KEY ("deployment_id") REFERENCES "Deployment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
