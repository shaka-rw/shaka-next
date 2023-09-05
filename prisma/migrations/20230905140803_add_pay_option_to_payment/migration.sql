-- CreateEnum
CREATE TYPE "PaymentOption" AS ENUM ('flutterwave', 'ubudasa');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentOption" "PaymentOption" NOT NULL DEFAULT 'flutterwave';
