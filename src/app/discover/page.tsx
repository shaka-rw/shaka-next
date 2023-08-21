import Navbar from '@/components/server/Navbar';
import SideSection from '@/components/client/SideSection';
import React, { Suspense } from 'react';
import CategoryBar from '@/components/client/CategoryBar';
import { NewDynamicProductList } from '@/components/server/NewProductList';
import prisma from '@/prima';
import { MdSearch } from 'react-icons/md';
import { notFound } from 'next/navigation';
import { ProductGender } from '@prisma/client';

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
    st: searchType,
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
    <div className=" grid items-start grid-cols-1 h-full md:grid-cols-[auto,1fr]">
      <div className="md:col-span-2">
        <Navbar />
        <CategoryBar catId={categoryId} categories={categories} />
      </div>
      <div className="relative h-full">
        <SideSection catId={categoryId} />
      </div>

      <Suspense
        fallback={
          <div className="container flex justify-center items-center">
            <span className="loading-dots loading-lg" />
          </div>
        }
      >
        <NewDynamicProductList products={products} title={<></>} />
      </Suspense>
      {/* <NewProductList isDiscover /> */}
    </div>
  );
};

export default Discover;

export const dynamic = 'force-dynamic';
