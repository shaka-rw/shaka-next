import React from 'react';
import { DiscoverSearchParams } from './page';
import prisma from '@/prisma';
import { Product, ProductGender } from '@prisma/client';
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
        where: {
          parent: (categoryId ? {
            id: categoryId,
          } : null
          )
        },
        take: 6,
        include: {
          products: {
            take: 5,
            where: {
              shop: { approved: true },
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
                    { categories: { some: { OR: [{ id: categoryId }, { subCategories: { some: { id: categoryId } } }] } } },
                    { shop: { category: { OR: [{ id: categoryId }, { subCategories: { some: { id: categoryId } } }] } } },
                  ],
                }
                : {}),
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
            _count: 'desc',
          },
        },
      });

  const allProductsCount = categories.reduce((a, c) => a + c.products.length, 0);

  return (

    <div className="mx-auto container p-1">
      {allProductsCount === 0 && (
        <div className="flex flex-col items-center gap-3 justify-center h-96">
          <h1 className="text-3xl font-bold">No products found</h1>
          <p className="text-lg text-gray-500">
            Try adjusting your search or filter to find what you&apos;re looking
            for.
          </p>
        </div>
      )}
      {categories.map((category) => {
        return category.products.length > 0 ? (
          <div key={category.id} className="flex flex-col w-full gap-2">
            <h3 className="text-2xl capitalize mt-8 mb-4 font-bold">
              {category.name}
            </h3>
            <Products products={category.products} />
          </div>
        ) : (
          <></>
        )
      }
      )}
    </div>
  );
};

export default DiscoverProducts;
