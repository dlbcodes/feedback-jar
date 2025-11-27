/*
  Warnings:

  - The primary key for the `Feedback` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assignedTo` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Feedback` table. All the data in the column will be lost.
  - The primary key for the `Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `typeId` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_profileId_fkey";

-- DropIndex
DROP INDEX "Feedback_email_idx";

-- DropIndex
DROP INDEX "Feedback_type_idx";

-- AlterTable
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_pkey",
DROP COLUMN "assignedTo",
DROP COLUMN "notes",
DROP COLUMN "type",
ADD COLUMN     "assignedToId" UUID,
ADD COLUMN     "typeId" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "projectId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Project" DROP CONSTRAINT "Project_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "domain" DROP NOT NULL,
ALTER COLUMN "timezone" DROP NOT NULL,
ADD CONSTRAINT "Project_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "FeedbackType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "emoji" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackComment" (
    "id" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "authorId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeedbackType_projectId_idx" ON "FeedbackType"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackType_projectId_name_key" ON "FeedbackType"("projectId", "name");

-- CreateIndex
CREATE INDEX "FeedbackComment_feedbackId_idx" ON "FeedbackComment"("feedbackId");

-- CreateIndex
CREATE INDEX "FeedbackComment_authorId_idx" ON "FeedbackComment"("authorId");

-- CreateIndex
CREATE INDEX "Feedback_typeId_idx" ON "Feedback"("typeId");

-- CreateIndex
CREATE INDEX "Feedback_assignedToId_idx" ON "Feedback"("assignedToId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackType" ADD CONSTRAINT "FeedbackType_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "FeedbackType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackComment" ADD CONSTRAINT "FeedbackComment_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackComment" ADD CONSTRAINT "FeedbackComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
