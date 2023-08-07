/*
  Warnings:

  - A unique constraint covering the columns `[productSizeId,productColorId]` on the table `ProductQuantity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductQuantity_productSizeId_productColorId_key" ON "ProductQuantity"("productSizeId", "productColorId");
