import Navbar from '@/components/server/Navbar';
import SideSection from '@/components/client/SideSection';
import React, { Suspense } from 'react';
import CategoryBar from '@/components/client/CategoryBar';
import prisma from '@/prima';
import { notFound } from 'next/navigation';
import { ProductGender } from '@prisma/client';
import NewShopList from '@/components/server/NewShopList';
import Products from '@/components/server/Products';
import Filters from '@/components/server/Filters';

const Discover = async ({
  searchParams,
}: {
  searchParams: {
    cat?: string;
    g?: string;
    st?: 'products' | 'shops';
    q?: string;
    sz?: string;
    p?: string;
  };
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
                ? { categories: { some: { id: categoryId } } }
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

  const shops =
    searchType !== 'shops'
      ? []
      : await prisma.shop.findMany({
          where: {
            ...(search
              ? {
                  OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    {
                      about: { contains: search, mode: 'insensitive' },
                    },
                  ],
                }
              : {}),
            ...(categoryId !== undefined && categoryId !== null
              ? { categoryId }
              : {}),
          },
          include: {
            _count: { select: { followers: true } },
            image: true,
            owner: true,
            category: true,
          },
        });

  const categories = await prisma.category.findMany({
    take: 30,
    // where: { NOT: { parent: null } },
    include: { image: true, subCategories: { include: { image: true } } },
  });

  const category = categories.find((c) => c.id === categoryId);

  if (categoryId && !category) {
    return notFound();
  }

  return (
    <div className=" flex flex-col h-full">
      <div className="md:col-span-2">
        <Navbar />
        <CategoryBar catId={categoryId} categories={categories} />
      </div>
      {/* <div className="relative h-full">
        <SideSection catId={categoryId} />
      </div> */}
      <Filters />

      <Suspense
        fallback={
          <div className="container flex p-3 justify-center items-center">
            <span className="loading-dots loading-lg" />
          </div>
        }
      >
        {searchType === 'products' && (
          <div className="mx-auto container p-1">
            <Products products={products} />
          </div>
          // <NewDynamicProductList products={products} title={<></>} />
        )}
        {searchType === 'shops' && <NewShopList shops={shops} />}
      </Suspense>
      {/* <NewProductList isDiscover /> */}
    </div>
  );
};

export default Discover;

export const dynamic = 'force-dynamic';
