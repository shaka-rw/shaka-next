/* eslint-disable @next/next/no-img-element */
import prisma from '@/prima';
import { User } from '@prisma/client';
import React from 'react';
import AddShopForm from './forms/AddShopForm';
import AddProductForm from './forms/AddProductForm';
import { approveShop } from '@/app/_actions';
import { MdEmojiObjects, MdShop, MdCheck } from 'react-icons/md';
import ProductList from './ProductList';

const SellerHome = async ({ user }: { user: User }) => {
  const shop = await prisma.shop.findFirst({ where: { userId: user.id } });

  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany({
    where: { shopId: shop?.id as string },
    include: { images: true, categories: true, sizes: true },
  });

  return (
    <div className="p-3">
      {shop ? (
        <>
          <AddProductForm shopId={shop.id} categories={categories} />
        </>
      ) : (
        <>
          <AddShopForm categories={categories} />
        </>
      )}

      <div className="divider"></div>
      <div>
        <h3 className="font-bold m-2 mt-3 text-2xl uppercase">My Products</h3>
      </div>
      {products.length === 0 && (
        <div className="alert  flex gap-2">
          <MdEmojiObjects /> No products added yet.
        </div>
      )}
      <ProductList products={products} />
    </div>
  );
};

export default SellerHome;
