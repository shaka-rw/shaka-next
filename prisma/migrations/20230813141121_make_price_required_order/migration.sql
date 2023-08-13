/*
  Warnings:

  - Made the column `price` on table `OrderQuantities` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OrderQuantities" ALTER COLUMN "price" SET NOT NULL;
