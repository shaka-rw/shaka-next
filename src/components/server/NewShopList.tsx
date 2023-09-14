/* eslint-disable @next/next/no-img-element */
import { DiscoverSearchParams } from '@/app/discover/page';
import prisma from '@/prisma';
import Link from '@/components/server/Link';
import React from 'react';
import { FaFan } from 'react-icons/fa';
import { FaArrowRight } from 'react-icons/fa6';
import { MdEmojiObjects } from 'react-icons/md';

const NewShopList = async ({
  searchParams,
}: {
  searchParams: DiscoverSearchParams;
}) => {
  const {
    q: search,
    st: searchType = 'products',
    cat: categoryId,
  } = searchParams;

  const shops =
    searchType !== 'shops'
      ? []
      : await prisma.shop.findMany({
          where: {
            approved: true,
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
            ...(categoryId ? { categoryId } : {}),
          },
          include: {
            _count: { select: { followers: true } },
            image: true,
            owner: true,
            category: true,
          },
        });

  return (
    <div className="flex flex-wrap w-full ">
      {shops.length === 0 && (
        <div className="flex justify-center items-center min-h-max w-full p-4">
          <div className="alert alert-info flex gap-2">
            <MdEmojiObjects /> No shops found.
          </div>
        </div>
      )}
      {shops.map((shop, index) => (
        <ShopCard
          key={shop.id}
          id={shop.id}
          name={shop.name}
          followersCount={shop._count.followers}
          description={shop.about}
          category={shop.category.name}
          image={shop.image.secureUrl}
          owner={shop.owner.name ?? shop.name}
        />
      ))}
    </div>
  );
};

const ShopCard = ({
  name,
  description,
  followersCount,
  owner,
  id,
  category,
  image,
}: {
  name: string;
  id: string;
  description: string;
  followersCount: number;
  owner: string;
  category: string;
  image: string;
}) => {
  return (
    <div className="flex justify-between w-full md:w-[230px] lg:w-[230px] flex-col bg-base-200 rounded-lg shadow-md p-4 m-4">
      <img
        src={image}
        alt={`Shop ${name}`}
        className="w-full h-48 object-cover rounded-md mb-4"
      />

      <div>
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-xs mb-2">{description}</p>
        <p className="text-sm mb-2">Owner: {owner}</p>
        <p className="text-sm mb-2">Category: {category}</p>
        <p className="text-sm mb-2">Followers: {followersCount}</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn btn-sm btn-accent transition duration-300">
          Follow <FaFan />
        </button>
        <Link
          href={`/shops/${id}`}
          className="btn btn-sm btn-outline btn-secondary transition duration-300"
        >
          Visit <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default NewShopList;
