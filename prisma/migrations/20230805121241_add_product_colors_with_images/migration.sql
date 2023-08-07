/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ProductAsset` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productId]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[assetId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[assetId]` on the table `ProductColor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assetId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ProductQuantity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductAsset" DROP CONSTRAINT "ProductAsset_productColorId_fkey";

-- DropForeignKey
ALTER TABLE "ProductAsset" DROP CONSTRAINT "ProductAsset_product_id_fkey";

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "isVideo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "productColorId" TEXT,
ADD COLUMN     "productId" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
ADD COLUMN     "assetId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductQuantity" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "ProductAsset";

-- CreateTable
CREATE TABLE "_ColorAssets" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ColorAssets_AB_unique" ON "_ColorAssets"("A", "B");

-- CreateIndex
CREATE INDEX "_ColorAssets_B_index" ON "_ColorAssets"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_productId_key" ON "Asset"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_assetId_key" ON "Product"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductColor_assetId_key" ON "ProductColor"("assetId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColorAssets" ADD CONSTRAINT "_ColorAssets_A_fkey" FOREIGN KEY ("A") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColorAssets" ADD CONSTRAINT "_ColorAssets_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductColor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
