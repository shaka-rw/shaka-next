import prisma from '@/prisma';
import React from 'react';
import Products from './Products';

const HomeProducts = async () => {
  const products = await prisma.product.findMany({
    take: 5,
    where: {
      AND: { quantities: { some: { quantity: { gt: 0 } } }, available: true },
    },
    include: {
      mainImage: true,
      shop: { include: { image: true, category: true } },
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

  return (
    <div className="flex container mx-auto flex-col gap-3">
      <h3 className="text-2xl mb-5 font-bold">Top Products</h3>
      <Products products={products} />
    </div>
  );
};

export default HomeProducts;
