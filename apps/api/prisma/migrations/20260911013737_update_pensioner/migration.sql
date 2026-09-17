/*
  Warnings:

  - The primary key for the `pensioner_data` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `transaction_data` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `updated_at` to the `pensioner_data` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `pensioner_data` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `transaction_data` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pensioner_id` on the `transaction_data` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('PENDING', 'PROCESSING', 'SYNCED', 'FAILED');

-- CreateEnum
CREATE TYPE "SyncAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- DropForeignKey
ALTER TABLE "transaction_data" DROP CONSTRAINT "transaction_data_pensioner_id_fkey";

-- AlterTable
ALTER TABLE "pensioner_data" DROP CONSTRAINT "pensioner_data_pkey",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "loan_amount" SET DATA TYPE DECIMAL(12,2),
ADD CONSTRAINT "pensioner_data_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "transaction_data" DROP CONSTRAINT "transaction_data_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "loan_amount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "processing_fee" SET DATA TYPE DECIMAL(12,2),
DROP COLUMN "pensioner_id",
ADD COLUMN     "pensioner_id" UUID NOT NULL,
ADD CONSTRAINT "transaction_data_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "sync_outbox" (
    "id" UUID NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" "SyncAction" NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "next_attempt_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locked_at" TIMESTAMP(3),
    "last_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "synced_at" TIMESTAMP(3),

    CONSTRAINT "sync_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sync_outbox_status_next_attempt_at_created_at_idx" ON "sync_outbox"("status", "next_attempt_at", "created_at");

-- CreateIndex
CREATE INDEX "sync_outbox_entity_type_entity_id_idx" ON "sync_outbox"("entity_type", "entity_id");

-- AddForeignKey
ALTER TABLE "transaction_data" ADD CONSTRAINT "transaction_data_pensioner_id_fkey" FOREIGN KEY ("pensioner_id") REFERENCES "pensioner_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
