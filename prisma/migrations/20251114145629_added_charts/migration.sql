-- CreateTable
CREATE TABLE "charts" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "chartType" TEXT NOT NULL,
    "eventTypes" TEXT[],
    "groupBy" TEXT,
    "timeRange" TEXT NOT NULL DEFAULT '7d',
    "granularity" TEXT NOT NULL DEFAULT 'day',
    "position" INTEGER NOT NULL DEFAULT 0,
    "width" TEXT NOT NULL DEFAULT 'full',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "charts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "charts" ADD CONSTRAINT "charts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
