/*
  Warnings:

  - You are about to drop the column `quantity` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the `_CartToProductQuantity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_productId_fkey";

-- DropForeignKey
ALTER TABLE "_CartToProductQuantity" DROP CONSTRAINT "_CartToProductQuantity_A_fkey";

-- DropForeignKey
ALTER TABLE "_CartToProductQuantity" DROP CONSTRAINT "_CartToProductQuantity_B_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "quantity",
DROP COLUMN "total",
ADD COLUMN     "totalAmount" INTEGER,
ADD COLUMN     "totalQuantity" INTEGER;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "gender" SET DEFAULT 'UNISEX';

-- DropTable
DROP TABLE "_CartToProductQuantity";

-- CreateTable
CREATE TABLE "QuantitiesOnCart" (
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "cartId" TEXT NOT NULL,
    "productQuantityId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuantitiesOnCart_pkey" PRIMARY KEY ("cartId","productQuantityId")
);

-- AddForeignKey
ALTER TABLE "QuantitiesOnCart" ADD CONSTRAINT "QuantitiesOnCart_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuantitiesOnCart" ADD CONSTRAINT "QuantitiesOnCart_productQuantityId_fkey" FOREIGN KEY ("productQuantityId") REFERENCES "ProductQuantity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
