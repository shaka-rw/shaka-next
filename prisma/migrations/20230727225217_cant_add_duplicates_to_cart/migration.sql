/*
  Warnings:

  - A unique constraint covering the columns `[productId,userId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cart_productId_userId_key" ON "Cart"("productId", "userId");
