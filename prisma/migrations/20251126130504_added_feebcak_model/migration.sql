/*
  Warnings:

  - You are about to drop the `analytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `charts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[scriptKey]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - The required column `scriptKey` was added to the `Project` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "analytics" DROP CONSTRAINT "analytics_projectId_fkey";

-- DropForeignKey
ALTER TABLE "charts" DROP CONSTRAINT "charts_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "scriptKey" TEXT NOT NULL;

-- DropTable
DROP TABLE "analytics";

-- DropTable
DROP TABLE "charts";

-- CreateTable
CREATE TABLE "Feedback" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "screenshotUrl" TEXT,
    "pageUrl" TEXT NOT NULL,
    "browser" TEXT,
    "browserVersion" TEXT,
    "os" TEXT,
    "deviceType" TEXT,
    "viewportWidth" INTEGER,
    "viewportHeight" INTEGER,
    "devicePixelRatio" DOUBLE PRECISION,
    "userAgent" TEXT,
    "sessionId" TEXT,
    "userId" TEXT,
    "metadata" JSONB,
    "customFields" JSONB,
    "status" TEXT NOT NULL DEFAULT 'new',
    "assignedTo" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Feedback_projectId_idx" ON "Feedback"("projectId");

-- CreateIndex
CREATE INDEX "Feedback_status_idx" ON "Feedback"("status");

-- CreateIndex
CREATE INDEX "Feedback_type_idx" ON "Feedback"("type");

-- CreateIndex
CREATE INDEX "Feedback_createdAt_idx" ON "Feedback"("createdAt");

-- CreateIndex
CREATE INDEX "Feedback_email_idx" ON "Feedback"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Project_scriptKey_key" ON "Project"("scriptKey");

-- CreateIndex
CREATE INDEX "Project_profileId_idx" ON "Project"("profileId");

-- CreateIndex
CREATE INDEX "Project_scriptKey_idx" ON "Project"("scriptKey");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
