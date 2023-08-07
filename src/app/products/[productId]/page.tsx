/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Carousel from '@/components/client/Carousel';
import AddToCartForm from '@/components/forms/AddToCartForm';
import Navbar from '@/components/server/Navbar';
import prisma from '@/prima';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { MdFavorite } from 'react-icons/md';

export const metadata: Metadata = {
  title: 'Shaka',
  icons: { icon: '/logo.png' },
  description: 'Shaka e-commerce - Rwanda',
};

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
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
  });
  if (!product) {
    return notFound();
  }

  return (
    <main className="">
      <Navbar />

      {/* <SingleProduct product={product} /> */}

      <div className="container mx-auto ">
        <div className="p-3 flex flex-col gap-2">
          <section className="w-full rounded pt-3 bg-base-200">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col justify-center w-full gap-2 items-start">
                <div className="bg-base-200 w-full rounded border-r-2 px-2">
                  <Carousel images={[]} colors={product.colors} />
                </div>
              </div>
              <div className="flex h-full flex-col  px-2 mb:px-0 gap-2 py-1 items-start">
                <h2 className="text-2xl font-semibold mb-2">{product?.name}</h2>

                <p className="text-lg  font-extrabold mb-2 text-secondary">
                  {product.quantities.map((q, i) =>
                    i > 0 ? (
                      <></>
                    ) : (
                      <span
                        key={q.id}
                        className={`${
                          i !== 0 ? 'border-l' : ''
                        } px-1 inline-block`}
                      >
                        {q.price} RWF
                      </span>
                    )
                  )}
                </p>

                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">Size</h3>
                  <div className="p-2 border bg-base-100 rounded flex gap-2 items-center flex-wrap">
                    {product.sizes.map((size) => (
                      <label
                        key={size.id}
                        className="flex items-center space-x-2 label cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="size"
                          className="radio radio-primary"
                        />
                        <span className="text-sm label-text capitalize">
                          {size.size}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-row items-center">
                  <AddToCartForm product={product as any} />
                  <button className="btn btn-secondary">
                    <MdFavorite /> Add to wishlist
                  </button>
                </div>
                <div className="flex flex-col mt-2 gap-2">
                  <div className="text-sm mb-2 font-semibold">Retailer</div>
                  <div className="mb-2 rounded flex items-center">
                    <div className="avatar rounded-full border w-10 h-10">
                      <div className="avatar w-10 h-10 overflow-hidden">
                        <img
                          className="h-full w-full object-contain"
                          src={product.shop.image.secureUrl}
                        />
                      </div>
                    </div>
                    <span className="text-lg ml-2 font-bold [text-transform:none]">
                      {product.shop.name}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col mt-2 gap-2">
                  <div className="text-sm mb-2 font-semibold">Description</div>
                  <div className="mb-2 p-2 bg-base-300 rounded text-center text-sm">
                    {product.description}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;

export const dynamic = 'force-dynamic';
