/* eslint-disable @next/next/no-img-element */
import prisma from '@/prima';
import React from 'react';
import { MdEmojiObjects } from 'react-icons/md';
import ProductList from './ProductList';
import CategoryList from './CategoryList';
import { NewDynamicProductList } from './server/NewProductList';

const GuestHome = async () => {
  const products = await prisma.product.findMany({
    where: {
      AND: { quantities: { some: { quantity: { gt: 0 } } }, available: true },
    },
    include: {
      mainImage: true,
      shop: { include: { image: true } },
      categories: { include: { image: true } },
      quantities: {
        where: { quantity: { gt: 0 } },
        distinct: ['productColorId', 'productSizeId'],
        include: { color: { include: { mainImage: true } }, size: true },
      },
      sizes: true,
      colors: { include: { mainImage: true, images: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany();
  return (
    <div className="p-3">
      <CategoryList categories={categories} />
      <div className="divider my-1"></div>
      <div>
        <h3 className="font-bold m-2 mt-3 text-2xl uppercase">Products</h3>
      </div>
      <div className="divider"></div>
      {products.length === 0 && (
        <div className="alert  flex gap-2">
          <MdEmojiObjects /> No products added yet.
        </div>
      )}
      {/* <ProductList products={products} /> */}
      <NewDynamicProductList products={products} />
    </div>
  );
};

export default GuestHome;
