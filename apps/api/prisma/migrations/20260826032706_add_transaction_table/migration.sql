-- CreateTable
CREATE TABLE "transaction_data" (
    "id" SERIAL NOT NULL,
    "term" INTEGER NOT NULL,
    "loan_amount" INTEGER NOT NULL,
    "processing_fee" INTEGER NOT NULL,

    CONSTRAINT "transaction_data_pkey" PRIMARY KEY ("id")
);
