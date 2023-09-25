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
    page: _page,
    st: searchType = 'products',
    g: gender,
    cat: categoryId,
    p: price,
  } = searchParams;

  const [minPrice, maxPrice] = price ? price.split('-').map(parseInfinity) : [];

  const categories =
    searchType !== 'products'
      ? []
      : await prisma.category.findMany({
          take: 30,
          // skip: parseInt(_page ?? '0') * 30,
          include: {
            products: {
              take: 10,
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
                            description: {
                              contains: search,
                              mode: 'insensitive',
                            },
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
                  ...(categoryId
                    ? {
                        OR: [
                          { categories: { some: { id: categoryId } } },
                          { shop: { category: { id: categoryId } } },
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
                  include: {
                    color: { include: { mainImage: true } },
                    size: true,
                  },
                },
                sizes: true,
                colors: { include: { mainImage: true, images: true } },
              },
            },
          },
          orderBy: {
            products: {
              _count: 'asc',
            },
          },
        });

  return (
    <div className="mx-auto container p-1">
      {categories.map((category) =>
        category.products.length > 0 ? (
          <div key={category.id} className="flex flex-col w-full gap-2">
            <h3 className="text-2xl capitalize mt-4 mb-2 font-bold">
              {category.name}
            </h3>
            <Products products={category.products} />
          </div>
        ) : (
          <></>
        )
      )}
    </div>
  );
};

export default DiscoverProducts;
