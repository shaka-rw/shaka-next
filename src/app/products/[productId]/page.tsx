/* eslint-disable @next/next/no-img-element */
import AppBar from '@/components/AppBar';
import HomeContent from '@/components/HomeContent';
import Carousel from '@/components/client/Carousel';
import AddToCartForm from '@/components/forms/AddToCartForm';
import prisma from '@/prima';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { MdAddShoppingCart, MdFavorite } from 'react-icons/md';

export const metadata: Metadata = {
  title: 'Shaka',
  icons: { icon: '/logo.png' },
  description: 'Shaka e-commerce - Rwanda',
};

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  // const productImages = [
  //   'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg', // Replace with actual image URLs
  //   'https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg',
  //   'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
  //   // Add more images here
  // ];

  const product = await prisma.product.findUnique({
    where: { id: params.productId },
    include: { images: true, shop: true, categories: true, sizes: true },
  });
  if (!product) {
    return notFound();
  }

  return (
    <main className="grid min-h-screen grid-rows-[auto,1fr] grid-cols-[1fr]">
      <AppBar />
      <div className="container mx-auto max-w-7xl">
        <div className="p-6">
          {/* <header className="bg-secondary py-4">...</header> */}
          <main className="mt-6">
            <section className="container min-h-[600px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Carousel
                  images={product.images
                    .filter((img) => !img.isVideo)
                    .map((img) => img.secureUrl)}
                />
                <div className="self-end flex flex-col gap-2 py-2 items-start">
                  <h2 className="text-2xl font-semibold mb-2">
                    {product?.name}
                  </h2>
                  <p className="text-3xl font-extrabold mb-4 mt-2">
                    {product?.price} RWF
                  </p>
                  <div className="flex gap-2 flex-row items-center">
                    <AddToCartForm product={product} />
                    <button className="btn btn-secondary">
                      <MdFavorite /> Add to wishlist
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-lg italic text-secondary font-semibold">
                      From
                    </div>
                    <div className="btn mb-2 flex items-center">
                      <div className="avatar rounded-full border w-10 h-10">
                        <div className="text-3xl">{product.shop.name[0]}</div>
                      </div>
                      <span className="text-xl [text-transform:none]">
                        {product.shop.name}
                      </span>
                    </div>
                  </div>

                  <p className="mt-6 text-lg">{product.description}</p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
