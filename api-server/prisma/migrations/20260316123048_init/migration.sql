/*
  Warnings:

  - You are about to drop the column `path_to_package_json` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deployment" ADD COLUMN     "path_to_package_json" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "path_to_package_json";
