/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Navbar from './Navbar';
import { NewDynamicProductList } from './NewProductList';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/prima';
import AddShopForm from '../forms/AddShopForm';
import HorizontalScroll from './HorizontalScroll';
import Image from 'next/image';
import VideoModal from './VideoModal';
import { Asset, Category } from '@prisma/client';

const NewHome = async () => {
  const session = await getServerSession(authOptions);

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
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany({
    take: 100,
    include: { image: true },
  });
  const shops = await prisma.shop.findMany({
    take: 100,
    include: { image: true },
  });

  return (
    <div>
      <Navbar />

      {/* Hero Section */}

      <div className="md:grid gap-3 flex flex-col items-center relative  md:grid-cols-[auto,1fr,1fr] bg-base-200/30 mx-auto container md:px-3 rounded px-2 py-8 backdrop-sm md:py-20">
        {/* <video
          src="/assets/videos/shaka.mp4"
          poster="/assets/imgs/shaka-banner.jpeg"
          className="h-full w-full object-cover -z-[1] absolute inset-0 rounded"
          controls={false}
          autoPlay
        /> */}
        <div className="hidden md:flex flex-col gap-4 p-2">
          <button className="text-3xl rounded-full border h-10 w-10">
            <span className="inline-block text-center -translate-y-2">.</span>
          </button>
          <button className="text-3xl border-secondary rounded-full border h-10 w-10">
            <span className="inline-block text-secondary text-center -translate-y-2">
              .
            </span>
          </button>
          <button className="text-3xl rounded-full border h-10 w-10">
            <span className="inline-block text-center -translate-y-2">.</span>
          </button>
          <button className="text-3xl rounded-full border h-10 w-10">
            <span className="inline-block text-center -translate-y-2">.</span>
          </button>
        </div>
        <div className=" flex flex-col md:ml-5 items-start gap-3 p-2">
          <div className="z text-4xl md:text-5xl  font-extrabold">
            SHOP QUICKLY, CHEAPLY & COMFORTABLY
          </div>
          <p className="text-lg mt-5">
            Shaka is changing the definition of e-commerce in Africa. Join us to
            book your ticket to the future of online shopping.
          </p>
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
        <div className="avatar justify-self-center self-center h-96 relative">
          <div className="absolute z-[1] p-4 bg-black/20 backdrop-blur-md border top-1/2 left-1/2 rounded-full -translate-y-1/2 -translate-x-1/2">
            <VideoModal />
          </div>
          <Image
            src={`/assets/imgs/shaka-banner.jpeg`}
            width={300}
            height={200}
            alt={'Shaka Banner'}
            className="mask mask-heart opacity-30 shadow border border-accent"
          />
        </div>
        {/* <div className="hidden md:block">
          <Carousel
            autoPlay={true}
            images={[
              '/assets/imgs/products/product-14-1.jpg',
              '/assets/imgs/products/product-16-2.jpg',
              '/assets/imgs/products/product-1-2.jpg',
            ]}
          />
        </div> */}
      </div>
      <HorizontalScroll
        speed={500}
        className="bg-accent/50 container mx-auto p-2 my-5"
      >
        <div className="items-center rounded flex w-full gap-2">
          {/* <div className="grid grid-cols-1 justify-items-center text-center md:text-start md:justify-items-start md:grid-cols-[auto,1fr] items-center bg-base-100/30 backdrop-blur border rounded-lg px-2 py-1 md:join-item grid-rows-2 gap-y-0 gap-x-2">
            <div className="avatar rounded-full overflow-hidden row-span-2 w-10 h-10">
              <img
                src="/assets/imgs/products/product-16-2.jpg"
                alt="profile"
                className="object-cover object-top w-10 h-10"
              />
            </div>
            <div className="row-span-2 text-base">Recommended for you.</div>
          </div> */}
          {shops.map((shop) => (
            <Link
              href={`/shops/${shop.id}`}
              key={shop.id}
              className="flex py-1 px-2 border rounded items-center gap-2 bg-base-100/30 hover:bg-accent"
            >
              <span className="avatar rounded-full overflow-hidden w-10 h-10">
                <img
                  src={shop.image.secureUrl}
                  alt="profile"
                  className="object-contain object-top w-10 h-10"
                />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-sm font-semibold">
                  {shop.name?.slice(0, 6)}
                </span>
                <span className="text-xs">
                  {((shop as any).about ?? 'More..').slice(0, 6)}
                </span>
              </span>
            </Link>
          ))}
          {/* {Array.from({ length: 12 }).map((_m, i) => (
            <div
              key={i}
              className="flex py-1 px-2 border rounded items-center gap-2 bg-base-100/30 hover:bg-accent"
            >
              <div className="avatar flex-1 rounded-full overflow-hidden  w-10 h-10">
                <img
                  src="/assets/imgs/products/product-16-2.jpg"
                  alt="profile"
                  className="object-contain object-top w-10 h-10"
                />
              </div>
              <div className="flex flex-none flex-col gap-1">
                <span className="text-sm font-semibold">Fashion</span>
                <span className="text-xs">Modern</span>
              </div>
            </div>
          ))} */}
        </div>
      </HorizontalScroll>
      {/* <div className="mx-auto max-w-7xl">
        <h3 className="my-3 text-xl">Shop By Categoies</h3>
      </div> */}

      <section className="py-8">
        <div className="container flex-col flex gap-3 mx-auto px-4">
          <div className="flex gap-2 justify-between">
            <h2 className="text-lg font-semibold">Shop by category</h2>
            <span className="link">All categories &rarr;</span>
          </div>
          <HorizontalScroll speed={500} className="bg-transparent">
            <div className="flex gap-2">
              {categories.map((cat: Category & { image: Asset }) => (
                <Link
                  href={!cat.parentId ? '/discover' : `/discover?cat=${cat.id}`}
                  key={cat.id}
                  className="flex rounded justify-between flex-col w-32 md:w-40 h-36  md:h-44 p-3 bg-base-200 gap-2"
                >
                  <span className="avatar rounded justify-self-end self-end overflow-hidden h-24 w-24 ">
                    <img
                      src={cat.image.secureUrl}
                      alt={cat.name}
                      className="object-contain object-center"
                    />
                  </span>
                  <span className="text-xl font-bold">{cat.name}</span>
                </Link>
              ))}
              {/* {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between flex-col w-32 md:w-40 h-36  md:h-44 p-3 bg-base-200 gap-2"
                >
                  <div className="avatar rounded justify-self-end self-end overflow-hidden h-24 w-24 ">
                    <img
                      src={`/assets/imgs/products/product-${i + 1}-1.jpg`}
                      alt="Category"
                      className="object-contain object-center"
                    />
                  </div>
                  <div className="text-xl font-bold">T-Shirts</div>
                </div>
              ))} */}
            </div>
          </HorizontalScroll>
        </div>
      </section>
      <section className="py-8">
        <div className="container grid md:grid-cols-2 gap-3 mx-auto">
          <div className="rounded bg-primary text-primary-content px-4 py-8 grid grid-cols-[1fr,auto] overflow-hidden">
            <div className="flex flex-col max-w-md gap-6 justify-between items-start">
              <div className="flex gap-4 flex-col">
                <h3 className="font-bold text-xl">Loyalty Program</h3>
                <p>Win prizes by purchasing you favorite products!</p>
              </div>

              <button className="btn btn-link text-primary-content btn-outline">
                See more
              </button>
            </div>
            <div className="avatar rounded justify-self-end self-end overflow-hidden h-40 w-40 ">
              <img
                src="/assets/imgs/products/product-16-2.jpg"
                alt="Category"
                className="object-contain object-center"
              />
            </div>
          </div>
          <div className="rounded bg-primary text-primary-content px-4 py-8 grid grid-cols-[1fr,auto] overflow-hidden">
            <div className="flex flex-col max-w-md gap-6 justify-between items-start">
              <div className="flex gap-4 flex-col">
                <h3 className="font-bold text-xl">Deals & offers</h3>
                <p>Cut the middle-men and by at wholesale prices 🔥</p>
              </div>

              <button className="btn btn-link text-primary-content btn-outline">
                See more
              </button>
            </div>
            <div className="avatar rounded justify-self-end self-end overflow-hidden h-40 w-40 ">
              <img
                src="/assets/imgs/products/product-16-2.jpg"
                alt="Category"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container rounded bg-base-200 mx-auto">
          <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col-reverse gap-2  md:grid md:grid-cols-2 overflow-hidden">
            <div className="flex flex-col max-w-md gap-6 justify-between items-start">
              <div className="flex flex-col gap-3">
                <div className="text-sm hidden md:block text-gray-600 mb-3">
                  Shaka Delivery
                </div>
                <h3 className="font-bold text-4xl uppercase">
                  Shaka delivers to your door.
                </h3>
                <p>Wherever you are in Kigali, buy and we will be there 🚀</p>
              </div>

              <button className="btn btn-link btn-outline">See more</button>
            </div>
            <div className="avatar rounded justify-self-end self-end overflow-hidden h-72 w-full max-w-full md:w-auto ">
              <img
                src="/assets/imgs/products/product-16-2.jpg"
                alt="Category"
                className="object-contain object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <NewDynamicProductList products={products} title={'Top Products'} />
    </div>
  );
};

export default NewHome;
