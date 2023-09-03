/* eslint-disable @next/next/no-img-element */
import Navbar from '@/components/server/Navbar';
import { NewDynamicProductList } from '@/components/server/NewProductList';
import prisma from '@/prima';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FaFan } from 'react-icons/fa';
import { MdCategory, MdPerson } from 'react-icons/md';

const ShopProfile = ({
  name,
  description,
  followersCount,
  owner,
  category,
  image,
}: {
  name: string;
  description: string;
  followersCount: number;
  owner: string;
  category: string;
  image: string;
}) => {
  return (
    <div className="bg-base-100">
      {/* <div className="bg-base-200 shadow-md">
        <img
          src={image}
          alt={`Shop ${name}`}
          className="w-full h-64 blur-md object-cover"
        />
    </div> */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-2 flex-wrap justify-center md:justify-normal mb-4">
          <div className="avatar p-1 md:pr-2 ">
            <div className="w-48 h-48">
              <Image src={image} height={192} width={192} className="mask-squircle" alt={`Shop ${name}`} />
            </div>
          </div>
          <div className="flex md:pl-3 items-center md:items-start md:border-l flex-col gap-1">
            <h1 className="text-3xl font-semibold mb-2">{name}</h1>
            <p className="text-gray-600 mb-4">{description}</p>
            <ul className="menu min-w-max h-full">
              <li className="">
                <a>
                  <MdPerson />{' '}
                  <span className="font-bold underline text-primary">
                    Owner:
                  </span>{' '}
                  {owner}
                </a>
              </li>
              <li className="">
                <a>
                  <MdCategory />{' '}
                  <span className="font-bold underline text-primary">
                    Category:
                  </span>{' '}
                  {category}
                </a>
              </li>
              <li className="">
                <a>
                  <FaFan />{' '}
                  <span className="font-bold underline text-primary">
                    Followers:
                  </span>{' '}
                  {followersCount}
                </a>
              </li>
              <div className="divider" />{' '}
              <button className="btn items-center justify-center w-fit btn-secondary">
                Follow Shop <AiOutlineUsergroupAdd />{' '}
              </button>
            </ul>
          </div>
        </div>
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
      _count: { select: { followers: true } },
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
          shop: { include: { image: true } },
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
      <ShopProfile
        name={shop.name}
        followersCount={shop._count.followers}
        description={shop.about}
        category={shop.category.name}
        image={shop.image.secureUrl}
        owner={shop.owner.name ?? shop.name}
      />
      <div className="divider">PRODUCTS</div>
      <NewDynamicProductList products={shop.products} />
    </div>
  );
};

export default ShopProfilePage;
