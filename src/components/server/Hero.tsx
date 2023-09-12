/* eslint-disable @next/next/no-img-element */
import Link from '@/components/server/Link';
import React from 'react';
import AddShopForm from '../forms/AddShopForm';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import prisma from '@/prisma';
import Image from 'next/image';

const Hero = async () => {
  const session = await getServerSession(authOptions);

  const categories = await prisma.category.findMany({
    take: 100,
    where: { parent: null },
    include: { image: true },
  });

  return (
    <div className="h-[500px] w-full flex items-center relative top-0">
      <div className="absolute inset-0">
        <Image
          height={500}
          width={1000}
          src={`/assets/imgs/bed.jpg`}
          className="w-full h-full object-cover"
          alt="Shaka Banner"
        />
        <div className="bg-gradient-to-r from-base-content/70 to-transparent absolute inset-0"></div>
      </div>
      <div className="grid container grid-cols-2 mx-auto p-4 m-2">
        <div className="flex z-[1] gap-10 flex-col">
          <h1 className="text-5xl md:text-6xl font-bold text-base-100">
            Exclusive shopping experience.
          </h1>
          <div className="flex items-center gap-3">
            <Link href={'/discover'} className="btn mt-6 btn-primary">
              Start Shopping &nbsp; &nbsp; &rarr;
            </Link>
            {session?.user && session.user.role === 'CUSTOMER' && (
              <AddShopForm
                btn={
                  <button className="btn mt-6 btn-outline btn-secondary">
                    Start a shop &nbsp; &nbsp; &rarr;
                  </button>
                }
                categories={categories}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
