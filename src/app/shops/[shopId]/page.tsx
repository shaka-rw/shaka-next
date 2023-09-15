/* eslint-disable @next/next/no-img-element */
import Navbar from '@/components/server/Navbar';
import { NewDynamicProductList } from '@/components/server/NewProductList';
import Products from '@/components/server/Products';
import prisma from '@/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { BsArrowUpCircleFill } from 'react-icons/bs';
import { FaFan } from 'react-icons/fa';
import { MdCategory, MdPerson, MdStar } from 'react-icons/md';

type StoreProfileData = {
  name: string;
  owner: string;
  image: string;
  followers: number;
  products: number;
  rating: number;
};

const ShopProfile = ({ storeInfo }: { storeInfo: StoreProfileData }) => {
  // Store and owner information

  return (
    <div className="grid p-3 mx-auto my-4 rounded-3xl bg-base-300 justify-items-stretch md:grid-cols-[auto,1fr] gap-4">
      <div className="p-2 md:p-4 flex w-full justify-center items-center flex-col ">
        <div className="avatar">
          <div className="w-40 md:w-48 rounded-full">
            <Image
              height={150}
              width={150}
              src={storeInfo.image}
              alt="Flower"
            />
          </div>
        </div>
      </div>
      <div className="flex md:items-start md:justify-self-start w-full  justify-center  flex-col px-2 py-4 gap-4">
        <div className="flex">
          <h3 className="text-2xl text-center w-full md:text-start font-bold">
            {storeInfo.name}
          </h3>
        </div>
        <div className="stats w-full stats-vertical md:stats-horizontal">
          <div className="stat">
            <div className="stat-title">Followers</div>
            <div className="stat-value">{storeInfo.followers}</div>
            <div className="stat-actions">
              <button className="btn btn-sm btn-success">Follow</button>
            </div>
          </div>

          <div className="stat justify-between gap-2 inline-flex flex-col">
            <div className="stat-title">Pruducts</div>
            <div className="stat-value gap-1 flex-1 inline-flex items-center">
              <BsArrowUpCircleFill className="text-xl" /> {storeInfo.products}
            </div>
            {/* <div className="stat-actions">
              <button className="btn btn-sm">Withdrawal</button>
              <button className="btn btn-sm">deposit</button>
            </div> */}
          </div>
          <div className="stat inline-flex gap-2 flex-col justify-between">
            <div className="stat-title">Rating</div>

            <div className="stat-value flex-1 inline-flex items-center">
              <MdStar className="text-yellow-500 text-2xl" />
              {storeInfo.rating.toFixed(1)}
            </div>
          </div>
        </div>
        <h3 className="text-2xl ml-2">
          By:{' '}
          <span className="font-bold link link-hover">{storeInfo.owner}</span>
        </h3>
      </div>
    </div>
  );
};

const ShopProfilePage = async ({
  params: { shopId },
}: {
  params: { shopId: string };
}) => {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      _count: {
        select: {
          followers: true,
          products: {
            where: {
              AND: {
                quantities: {
                  some: {
                    quantity: { gt: 0 },
                  },
                },
                available: true,
              },
            },
          },
        },
      },
      image: true,
      owner: true,
      category: true,
      products: {
        where: {
          AND: {
            quantities: {
              some: {
                quantity: { gt: 0 },
              },
            },
            available: true,
          },
        },
        include: {
          mainImage: true,
          colors: { include: { mainImage: true, images: true } },
          shop: { include: { image: true, owner: true, category: true } },
          categories: true,
          quantities: {
            include: { color: { include: { mainImage: true } }, size: true },
          },
          sizes: true,
        },
      },
    },
  });

  if (!shop) return notFound();

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-2 md:p-1">
        <ShopProfile
          storeInfo={{
            name: shop.name,
            owner: shop.owner.name ?? 'Unknown',
            image: shop.image.secureUrl,
            followers: shop._count.followers,
            products: shop._count.products,
            rating: Number((Math.random() * 0).toFixed(1)),
          }}
        />
        <div className="divider w-1/2 mx-auto space-x-2">PRODUCTS</div>
        <Products products={shop.products} />
      </div>
    </div>
  );
};

export default ShopProfilePage;
