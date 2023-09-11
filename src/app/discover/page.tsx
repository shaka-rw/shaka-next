import Navbar from '@/components/server/Navbar';
import React, { Suspense } from 'react';
import prisma from '@/prisma';
import { notFound } from 'next/navigation';
import NewShopList from '@/components/server/NewShopList';
import Filters from '@/components/server/Filters';
import DiscoverCategories from '@/components/server/DiscoverCategories';
import DiscoverCategoriesSkeleton from '@/components/server/skeletons/DiscoverCategoriesSkeleton';
import DiscoverProducts from './DiscoverProducts';
import ProductsSkeleton from '@/components/server/skeletons/ProductsSkeleton';

export type DiscoverSearchParams = {
  cat?: string;
  g?: string;
  st?: 'products' | 'shops';
  q?: string;
  sz?: string;
  p?: string;
};

const Discover = async ({
  searchParams,
}: {
  searchParams: DiscoverSearchParams;
}) => {
  const {
    q: search,
    sz: size,
    st: searchType = 'products',
    g: gender,
    cat: categoryId,
    p: price,
  } = searchParams;

  const category = categoryId
    ? await prisma.category.findUnique({
        where: { id: categoryId },
      })
    : null;

  if (categoryId && !category) {
    return notFound();
  }

  return (
    <div className=" flex flex-col h-full">
      <div className="md:col-span-2">
        <Navbar />
        <Suspense fallback={<DiscoverCategoriesSkeleton />}>
          <DiscoverCategories categoryId={categoryId} />
        </Suspense>
      </div>
      {/* <div className="relative h-full">
        <SideSection catId={categoryId} />
      </div> */}
      <Filters />

      <Suspense
        fallback={
          <div className="mx-auto container p-1">
            <ProductsSkeleton />
          </div>
        }
      >
        {searchType === 'products' && (
          <DiscoverProducts searchParams={searchParams} />
        )}
        {searchType === 'shops' && <NewShopList searchParams={searchParams} />}
      </Suspense>
    </div>
  );
};

export default Discover;

export const dynamic = 'force-dynamic';
