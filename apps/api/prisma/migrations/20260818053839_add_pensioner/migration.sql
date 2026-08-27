-- CreateTable
CREATE TABLE "pensioner_data" (
    "id" SERIAL NOT NULL,
    "firstname" VARCHAR(100),
    "last" VARCHAR(100),
    "age" DECIMAL(10,2),
    "salary" DECIMAL(10,2),

    CONSTRAINT "pensioner_data_pkey" PRIMARY KEY ("id")
);
