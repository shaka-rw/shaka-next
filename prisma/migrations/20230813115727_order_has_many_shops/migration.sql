/*
  Warnings:

  - You are about to drop the column `shopId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shopId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_shopId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shopId";

-- CreateTable
CREATE TABLE "_OrderToShop" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderToShop_AB_unique" ON "_OrderToShop"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderToShop_B_index" ON "_OrderToShop"("B");

-- AddForeignKey
ALTER TABLE "_OrderToShop" ADD CONSTRAINT "_OrderToShop_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToShop" ADD CONSTRAINT "_OrderToShop_B_fkey" FOREIGN KEY ("B") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
