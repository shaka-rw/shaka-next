/*
  Warnings:

  - You are about to drop the column `isPaid` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `_OrderToProductQuantity` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PayStatus" AS ENUM ('pending', 'successful');

-- DropForeignKey
ALTER TABLE "_OrderToProductQuantity" DROP CONSTRAINT "_OrderToProductQuantity_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToProductQuantity" DROP CONSTRAINT "_OrderToProductQuantity_B_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "isPaid",
ADD COLUMN     "productQuantityId" TEXT;

-- DropTable
DROP TABLE "_OrderToProductQuantity";

-- CreateTable
CREATE TABLE "OrderQuantities" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "productQuantityId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "OrderQuantities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "status" "PayStatus" NOT NULL DEFAULT 'pending',
    "transaction_id" INTEGER,
    "amount" DOUBLE PRECISION NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'RWF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderQuantities_orderId_productQuantityId_key" ON "OrderQuantities"("orderId", "productQuantityId");

-- AddForeignKey
ALTER TABLE "OrderQuantities" ADD CONSTRAINT "OrderQuantities_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderQuantities" ADD CONSTRAINT "OrderQuantities_productQuantityId_fkey" FOREIGN KEY ("productQuantityId") REFERENCES "ProductQuantity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productQuantityId_fkey" FOREIGN KEY ("productQuantityId") REFERENCES "ProductQuantity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
