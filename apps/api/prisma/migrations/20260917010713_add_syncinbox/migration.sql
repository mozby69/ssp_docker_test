-- CreateTable
CREATE TABLE "sync_inbox" (
    "id" UUID NOT NULL,
    "source_node" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" "SyncAction" NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sync_inbox_source_node_idx" ON "sync_inbox"("source_node");
