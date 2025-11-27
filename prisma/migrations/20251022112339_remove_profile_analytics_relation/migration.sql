/*
  Warnings:

  - You are about to drop the column `userId` on the `analytics` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."analytics" DROP CONSTRAINT "analytics_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."analytics" DROP CONSTRAINT "analytics_userId_fkey";

-- AlterTable
ALTER TABLE "analytics" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
