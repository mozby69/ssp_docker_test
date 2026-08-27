/*
  Warnings:

  - You are about to drop the column `last` on the `pensioner_data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pensioner_data" DROP COLUMN "last",
ADD COLUMN     "lastname" VARCHAR(100);
