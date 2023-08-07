/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Carousel from '../client/Carousel';
import Navbar from './Navbar';
import NewProductList, { NewDynamicProductList } from './NewProductList';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/prima';
import AddShopForm from '../forms/AddShopForm';

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

      <div className="md:grid gap-3 flex flex-col items-center  md:grid-cols-[auto,1fr,1fr] bg-base-200 mx-auto container md:px-3 rounded px-2 py-8 md:py-20">
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
          <div className=" text-4xl md:text-5xl  font-extrabold">
            SHOP QUICKLY, CHEAPLY & COMFORTABLY
          </div>
          <p className="text-lg mt-5">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque quis
            a illo tenetur eum minima quidem pariatur sunt numquam quas!
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
        <div className="hidden md:block">
          <Carousel
            autoPlay={true}
            images={[
              '/assets/imgs/products/product-14-1.jpg',
              '/assets/imgs/products/product-16-2.jpg',
              '/assets/imgs/products/product-1-2.jpg',
            ]}
          />
        </div>
      </div>
      <div className="p-3 container  md:flex-wrap mx-auto my-5 [&>div]:flex-1 items-center  rounded md:join bg-amber-200/50 grid grid-cols-2 md:flex justify-stretch w-full gap-6">
        <div className="grid grid-cols-1 justify-items-center text-center md:text-start md:justify-items-start md:grid-cols-[auto,1fr] items-center bg-base-100/30 backdrop-blur border rounded-lg px-2 py-1 md:join-item grid-rows-2 gap-y-0 gap-x-2">
          <div className="avatar rounded-full overflow-hidden row-span-2 w-14 h-14">
            <img
              src="/assets/imgs/products/product-16-2.jpg"
              alt="profile"
              className="object-cover object-top w-full h-full"
            />
          </div>
          <div className="row-span-2 text-base">Recommended for you.</div>
        </div>
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="grid grid-cols-1 justify-items-center text-center md:text-start md:justify-items-start md:grid-cols-[auto,1fr] items-center bg-base-100/30 backdrop-blur border rounded-lg px-2 py-1 md:join-item grid-rows-2 gap-y-0 gap-x-2"
          >
            <div className="avatar rounded-full overflow-hidden row-span-2 w-14 h-14">
              <img
                src={shop.image.secureUrl}
                alt="profile"
                className="object-cover object-top w-full h-full"
              />
            </div>
            <span className="text-lg font-bold">{shop.name}</span>
            <span className="text-sm">
              {(shop as any).about ?? 'Modern fashion trends'}
            </span>
          </div>
        ))}
        <div className="grid grid-cols-1 justify-items-center text-center md:text-start md:justify-items-start md:grid-cols-[auto,1fr] items-center bg-base-100/30 backdrop-blur border rounded-lg px-2 py-1 md:join-item grid-rows-2 gap-y-0 gap-x-2">
          <div className="avatar rounded-full overflow-hidden row-span-2 w-14 h-14">
            <img
              src="/assets/imgs/products/product-16-2.jpg"
              alt="profile"
              className="object-cover object-top w-full h-full"
            />
          </div>
          <span className="text-lg font-bold">Fashion</span>
          <span className="text-sm">Modern fashion trends</span>
        </div>
        <div className="grid grid-cols-1 justify-items-center text-center md:text-start md:justify-items-start md:grid-cols-[auto,1fr] items-center bg-base-100/30 backdrop-blur border rounded-lg px-2 py-1 md:join-item grid-rows-2 gap-y-0 gap-x-2">
          <div className="avatar rounded-full overflow-hidden row-span-2 w-14 h-14">
            <img
              src="/assets/imgs/products/product-16-2.jpg"
              alt="profile"
              className="object-cover object-top w-full h-full"
            />
          </div>
          <span className="text-lg font-bold">Fashion</span>
          <span className="text-sm">Modern fashion trends</span>
        </div>
        <div className="grid grid-cols-1 justify-items-center text-center md:text-start md:justify-items-start md:grid-cols-[auto,1fr] items-center bg-base-100/30 backdrop-blur border rounded-lg px-2 py-1 md:join-item grid-rows-2 gap-y-0 gap-x-2">
          <div className="avatar rounded-full overflow-hidden row-span-2 w-14 h-14">
            <img
              src="/assets/imgs/products/product-16-2.jpg"
              alt="profile"
              className="object-cover object-top w-full h-full"
            />
          </div>
          <span className="text-lg font-bold">Fashion</span>
          <span className="text-sm">Modern fashion trends</span>
        </div>
      </div>
      {/* <div className="mx-auto max-w-7xl">
        <h3 className="my-3 text-xl">Shop By Categoies</h3>
      </div> */}

      <section className="py-8">
        <div className="container flex-col flex gap-3 mx-auto px-4">
          <div className="flex gap-2 justify-between">
            <h2 className="text-lg font-semibold">Shop by category</h2>
            <span className="link">All categories &rarr;</span>
          </div>
          <div className="grid grid-cols-[auto,auto] md:flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex justify-between flex-col w-32 md:w-40 h-36  md:h-44 p-3 bg-base-200 gap-2"
              >
                <div className="avatar rounded justify-self-end self-end overflow-hidden h-24 w-24 ">
                  <img
                    src={cat.image.secureUrl}
                    alt={cat.name}
                    className="object-contain object-center"
                  />
                </div>
                <div className="text-xl font-bold">{cat.name}</div>
              </div>
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
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
            ))}
          </div>
        </div>
      </section>
      <section className="py-8">
        <div className="container grid md:grid-cols-2 gap-3 mx-auto">
          <div className="rounded bg-amber-100/95 px-4 py-8 grid grid-cols-[1fr,auto] overflow-hidden">
            <div className="flex flex-col max-w-md gap-6 justify-between items-start">
              <div className="flex flex-col">
                <h3 className="font-bold text-xl">Loyalty Program</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Nesciunt, ut?
                </p>
              </div>

              <button className="btn btn-link btn-outline">See more</button>
            </div>
            <div className="avatar rounded justify-self-end self-end overflow-hidden h-40 w-40 ">
              <img
                src="/assets/imgs/products/product-16-2.jpg"
                alt="Category"
                className="object-contain object-center"
              />
            </div>
          </div>
          <div className="rounded bg-amber-100/95 px-4 py-8 grid grid-cols-[1fr,auto] overflow-hidden">
            <div className="flex flex-col max-w-md gap-6 justify-between items-start">
              <div className="flex flex-col">
                <h3 className="font-bold text-xl">Deals & offers</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Nesciunt, ut?
                </p>
              </div>

              <button className="btn btn-link btn-outline">See more</button>
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
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Nesciunt, ut?
                </p>
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
