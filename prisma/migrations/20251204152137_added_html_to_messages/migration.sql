-- AlterTable
ALTER TABLE "RouteMessage" ADD COLUMN     "autoHide" INTEGER,
ADD COLUMN     "builderData" JSONB,
ADD COLUMN     "clicks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ctaAction" TEXT,
ADD COLUMN     "ctaText" TEXT,
ADD COLUMN     "ctaUrl" TEXT,
ADD COLUMN     "dismissable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "dismissals" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "displayType" TEXT NOT NULL DEFAULT 'popover',
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "messageHtml" TEXT,
ADD COLUMN     "messageType" TEXT NOT NULL DEFAULT 'text',
ADD COLUMN     "showOnce" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "theme" JSONB,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "RouteMessage_priority_idx" ON "RouteMessage"("priority");
