/*
  Warnings:

  - You are about to drop the column `userId` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[project_id]` on the table `Deployment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[deployment_id]` on the table `Log_Events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Deployment_project_id_key" ON "Deployment"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "Log_Events_deployment_id_key" ON "Log_Events"("deployment_id");

-- CreateIndex
CREATE UNIQUE INDEX "Project_user_id_key" ON "Project"("user_id");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
