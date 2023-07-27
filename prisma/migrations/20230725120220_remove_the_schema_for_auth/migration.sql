/*
  Warnings:

  - You are about to drop the `billing_address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `business_account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `coupon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `market` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `refresh_token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shop_stock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sub_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `variant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `whish_list` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "billing_address" DROP CONSTRAINT "billing_address_order_id_fkey";

-- DropForeignKey
ALTER TABLE "billing_address" DROP CONSTRAINT "billing_address_user_id_fkey";

-- DropForeignKey
ALTER TABLE "business_account" DROP CONSTRAINT "business_account_user_id_fkey";

-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_order_id_fkey";

-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_product_id_fkey";

-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_user_id_fkey";

-- DropForeignKey
ALTER TABLE "coupon" DROP CONSTRAINT "coupon_user_id_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_product_id_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_user_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_category_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_sub_category_id_fkey";

-- DropForeignKey
ALTER TABLE "product_image" DROP CONSTRAINT "product_image_product_id_fkey";

-- DropForeignKey
ALTER TABLE "refresh_token" DROP CONSTRAINT "refresh_token_user_id_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_fkey";

-- DropForeignKey
ALTER TABLE "shop" DROP CONSTRAINT "shop_market_id_fkey";

-- DropForeignKey
ALTER TABLE "shop" DROP CONSTRAINT "shop_retailer_fkey";

-- DropForeignKey
ALTER TABLE "shop_stock" DROP CONSTRAINT "shop_stock_product_id_fkey";

-- DropForeignKey
ALTER TABLE "shop_stock" DROP CONSTRAINT "shop_stock_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "sub_category" DROP CONSTRAINT "sub_category_category_id_fkey";

-- DropForeignKey
ALTER TABLE "variant" DROP CONSTRAINT "variant_product_id_fkey";

-- DropForeignKey
ALTER TABLE "whish_list" DROP CONSTRAINT "whish_list_product_id_fkey";

-- DropForeignKey
ALTER TABLE "whish_list" DROP CONSTRAINT "whish_list_user_id_fkey";

-- DropTable
DROP TABLE "billing_address";

-- DropTable
DROP TABLE "business_account";

-- DropTable
DROP TABLE "cart";

-- DropTable
DROP TABLE "category";

-- DropTable
DROP TABLE "coupon";

-- DropTable
DROP TABLE "market";

-- DropTable
DROP TABLE "order";

-- DropTable
DROP TABLE "product";

-- DropTable
DROP TABLE "product_image";

-- DropTable
DROP TABLE "refresh_token";

-- DropTable
DROP TABLE "service";

-- DropTable
DROP TABLE "session";

-- DropTable
DROP TABLE "shop";

-- DropTable
DROP TABLE "shop_stock";

-- DropTable
DROP TABLE "sub_category";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "variant";

-- DropTable
DROP TABLE "whish_list";
