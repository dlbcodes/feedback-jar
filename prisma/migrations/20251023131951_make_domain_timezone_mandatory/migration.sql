/*
  Warnings:

  - Made the column `domain` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `timezone` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "domain" SET NOT NULL,
ALTER COLUMN "timezone" SET NOT NULL;
