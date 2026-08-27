/*
  Warnings:

  - You are about to drop the column `salary` on the `pensioner_data` table. All the data in the column will be lost.
  - You are about to alter the column `age` on the `pensioner_data` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "pensioner_data" DROP COLUMN "salary",
ADD COLUMN     "loan_amount" DECIMAL(10,2),
ADD COLUMN     "loan_type" VARCHAR(200),
ALTER COLUMN "age" SET DATA TYPE INTEGER;
