/*
  Warnings:

  - Added the required column `pensioner_id` to the `transaction_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction_data" ADD COLUMN     "pensioner_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "transaction_data" ADD CONSTRAINT "transaction_data_pensioner_id_fkey" FOREIGN KEY ("pensioner_id") REFERENCES "pensioner_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
