/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import Simplebar from '../client/SimpleBar';
import prisma from '@/prisma';

export type Shop = {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
};

const HomeShops = async () => {
  const shops = await prisma.shop.findMany({
    take: 100,
    where: { approved: true },
    include: { image: true },
  });

  return (
    <div className="container my-10 p-2 mx-auto ">
      <h3 className="text-2xl mb-5 font-bold">Shop by Shops</h3>
      <Simplebar>
        <div className="grid max-w-full rounded-sm p-1 grid-rows-2 grid-flow-col gap-3">
          {shops.map((shop) => (
            <Link
              href={`/shops/${shop.id}`}
              key={shop.id}
              className="grid w-[300px] border border-transparent hover:border-primary cursor-pointer p-3 rounded-lg bg-base-200/50 items-center  gap-2 grid-cols-[auto,1fr]"
            >
              <img
                src={shop.image.secureUrl}
                className="w-10 h-10 object-cover rounded-full"
                alt={shop.name}
              />
              <span className="flex gap-1 flex-col">
                <span className="text-sm font-semibold">{shop.name}</span>
                <span className="text-xs h-4 w-full flex overflow-hidden text-base-content">
                  {shop.about}...
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Simplebar>
    </div>
  );
};

export default HomeShops;
