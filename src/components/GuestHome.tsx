/* eslint-disable @next/next/no-img-element */
import prisma from '@/prima';
import React from 'react';
import { MdEmojiObjects } from 'react-icons/md';
import ProductList from './ProductList';
import CategoryList from './CategoryList';

const GuestHome = async () => {
  const products = await prisma.product.findMany({
    include: { images: true, categories: true, sizes: true },
    orderBy: { createdAt: 'desc' },
  });
  const categories = await prisma.category.findMany();
  return (
    <div className="p-3">
      <section className="bg-gradient-to-r rounded from-blue-500 via-purple-500 to-pink-500 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:items-center md:grid-cols-2 gap-6">
            <div className="flex flex-col items-start gap-2 md:gap-3">
              <h2 className="text-4xl font-bold mb-4">
                SHAKA E-commerce
              </h2>
              <p className="text-lg mb-4">
                Discover the best products from various shops all in one place.
              </p>
              <button className="btn btn-primary">Explore Now</button>
            </div>
            <div className="flex justify-center items-center">
              <img
                // src="https://blog.logrocket.com/wp-content/uploads/2019/05/logrocket-blog.jpg" // Replace this with the URL of your hero image
                src="/logo_.png" // Replace this with the URL of your hero image
                alt="Premium E-commerce Platform"
                className="rounded-md shadow-md"
              />
            </div>
          </div>
        </div>
      </section>
      <CategoryList categories={categories} />
      <div className="divider my-1"></div>
      <div>
        <h3 className="font-bold m-2 mt-3 text-2xl uppercase">Products</h3>
      </div>
      <div className="divider"></div>
      {products.length === 0 && (
        <div className="alert  flex gap-2">
          <MdEmojiObjects /> No products added yet.
        </div>
      )}
      <ProductList products={products} />
    </div>
  );
};

export default GuestHome;
