/*
  Warnings:

  - You are about to drop the column `productId` on the `Cart` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Cart_productId_userId_key";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "productId";
