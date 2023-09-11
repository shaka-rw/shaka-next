import React from 'react';
import { DiscoverSearchParams } from './page';
import prisma from '@/prisma';
import { ProductGender } from '@prisma/client';
import Products from '@/components/server/Products';

const DiscoverProducts = async ({
  searchParams,
}: {
  searchParams: DiscoverSearchParams;
}) => {
  function parseInfinity(value: string) {
    return value === '-Infinity'
      ? -Infinity
      : value === 'Infinity'
      ? Infinity
      : parseFloat(value);
  }

  const {
    q: search,
    sz: size,
    st: searchType = 'products',
    g: gender,
    cat: categoryId,
    p: price,
  } = searchParams;

  const [minPrice, maxPrice] = price ? price.split('-').map(parseInfinity) : [];

  const products =
    searchType !== 'products'
      ? []
      : await prisma.product.findMany({
          where: {
            AND: {
              quantities: {
                some: {
                  AND: {
                    quantity: { gt: 0 },
                    ...(price
                      ? {
                          price: {
                            gte: isNaN(minPrice) ? undefined : minPrice,
                            lte: isNaN(maxPrice) ? undefined : maxPrice,
                          },
                        }
                      : {}),
                  },
                },
              },
              ...(search
                ? {
                    OR: [
                      { name: { contains: search, mode: 'insensitive' } },
                      {
                        description: { contains: search, mode: 'insensitive' },
                      },
                    ],
                  }
                : {}),
              available: true,
              ...(gender
                ? { gender: { equals: gender as ProductGender } }
                : {}),
              ...(size
                ? {
                    sizes: {
                      some: { size: { equals: size, mode: 'insensitive' } },
                    },
                  }
                : {}),
              ...(categoryId !== undefined && categoryId !== null
                ? {
                    OR: [
                      {
                        categories: { some: { id: categoryId } },
                        shop: { categoryId },
                      },
                    ],
                  }
                : {}),
              // categories: { some: { id: catId || undefined } },
            },
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
        });

  return (
    <div className="mx-auto container p-1">
      <Products products={products} />
    </div>
  );
};

export default DiscoverProducts;
