/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import ProductInfo from '@/components/client/ProductInfo';
import Navbar from '@/components/server/Navbar';
import prisma from '@/prisma';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

export const metadata: Metadata = {
  title: 'Shaka',
  icons: { icon: '/logo.png' },
  description: 'Shaka e-commerce - Rwanda',
};

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const product = await prisma.product.findUnique({
    where: { id: params.productId, shop: { approved: true } },
    include: {
      mainImage: true,
      colors: { include: { mainImage: true, images: true } },
      shop: { include: { image: true } },
      categories: { include: { image: true } },

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
      <ProductInfo product={product} />
      {/* <div className="container mx-auto ">
        <div className="p-3 flex flex-col gap-2">
          <section className="w-full rounded pt-3">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col justify-center w-full gap-2 items-start">
                <div className="bg-base-200 w-full rounded border-r-2 px-2">
                  <Carousel images={[]} colors={product.colors} />
                </div>
              </div>
              <div className="flex h-full flex-col  px-2 mb:px-0 gap-2 py-1 items-start">
                <h2 className="text-2xl font-semibold mb-1">{product?.name}</h2>

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
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs font-semibold">
                    <span className="font-mono mr-2">
                      {product.sizes.length}
                    </span>
                    Size(s)
                  </span>
                  <span className="font-bold -translate-y-1">.</span>
                  <span className="text-xs font-semibold">
                    <span className="mr-2">{product.colors.length}</span>
                    Color(s)
                  </span>
                </div>
                <div className="flex gap-2 flex-row items-center">
                  <button className="btn btn-secondary btn-sm btn-outline btn-circle">
                    <MdFavorite />
                  </button>
                  <AddToCartForm
                    btnText="Add to cart"
                    product={product as any}
                  />
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
      </div> */}
    </main>
  );
};

export default ProductPage;

export const dynamic = 'force-dynamic';
