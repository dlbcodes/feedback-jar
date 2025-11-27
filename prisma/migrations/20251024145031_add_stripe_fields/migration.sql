/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "stripeCurrentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripePriceId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT,
ADD COLUMN     "subscriptionTier" TEXT NOT NULL DEFAULT 'trial',
ADD COLUMN     "trialEndsAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_stripeCustomerId_key" ON "profiles"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_stripeSubscriptionId_key" ON "profiles"("stripeSubscriptionId");
