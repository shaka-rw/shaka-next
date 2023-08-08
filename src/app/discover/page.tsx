import Navbar from '@/components/server/Navbar';
import SideSection from '@/components/client/SideSection';
import React from 'react';
import CategoryBar from '@/components/client/CategoryBar';
import { NewDynamicProductList } from '@/components/server/NewProductList';
import prisma from '@/prima';
import { MdSearch } from 'react-icons/md';

const Discover = async () => {
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
  });

  const categories = await prisma.category.findMany({
    take: 100,
    include: { image: true },
  });

  return (
    <div className=" grid items-start grid-cols-1 md:grid-cols-[auto,1fr]">
      <div className="md:col-span-2">
        <Navbar />
        <CategoryBar categories={categories} />
      </div>
      <div className="relative">
        <SideSection />
      </div>
      <NewDynamicProductList
        products={products}
        title={
          <>
            <div className="form-control relative w-full max-w-xs">
              <MdSearch className="text-xl absolute top-1/2 left-2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search.."
                className="input input-bordered w-full max-w-xs pl-8"
              />
            </div>
          </>
        }
      />
      {/* <NewProductList isDiscover /> */}
    </div>
  );
};

export default Discover;

export const dynamic = 'force-dynamic';
