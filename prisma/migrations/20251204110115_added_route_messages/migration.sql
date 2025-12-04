-- CreateTable
CREATE TABLE "RouteMessage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "matchType" TEXT NOT NULL DEFAULT 'exact',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RouteMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RouteMessage_projectId_idx" ON "RouteMessage"("projectId");

-- CreateIndex
CREATE INDEX "RouteMessage_isActive_idx" ON "RouteMessage"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "RouteMessage_projectId_route_key" ON "RouteMessage"("projectId", "route");

-- AddForeignKey
ALTER TABLE "RouteMessage" ADD CONSTRAINT "RouteMessage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
