/* eslint-disable @next/next/no-img-element */
import { Product, Asset } from '@prisma/client';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { MdFavorite, MdAddShoppingCart, MdAddBox } from 'react-icons/md';
import AddVariationsForm from '../forms/AddVariationsForm';

export const SellerProductList = ({
  isDiscover = false,
  title,
  link,
  products,
  className,
}: {
  products: Product[];
  title?: ReactNode;
  link?: ReactNode;
  className?: string;
  isDiscover?: boolean;
}) => {
  return (
    <section className={`${isDiscover ? 'my-4' : 'my-8'}`}>
      <div className="container flex-col flex gap-3 mx-auto px-3">
        <div className="flex gap-2 justify-between">
          {title && <>{title}</>}
          {link && <>{link}</>}
        </div>
        <div
          className={`grid grid-cols-2 ${
            className ?? ''
          }  md:grid-cols-3 gap-2 py-4`}
        >
          {products.map((product, i) => (
            <div
              key={i}
              className="max-w-xs flex flex-col bg-base-200 rounded-md p-3 gap-3"
            >
              <div className="avatar rounded justify-self-end self-end overflow-hidden h-52 w-full">
                <img
                  src={((product as any).mainImage as Asset).secureUrl}
                  alt={product.name}
                  className="object-contain object-center"
                />
              </div>
              <div className="flex flex-col mt-2 gap-2">
                <span className="text-sm text-gray-500">Ships to Kigali</span>
                <Link
                  href={`/products/${product.id}`}
                  className="text-lg font-semibold"
                >
                  {product.name}
                </Link>
                <div className="flex gap-3">
                  <div className="rating rating-sm">
                    <input
                      type="radio"
                      name="rating-2"
                      className="mask mask-star-2 bg-secondary"
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      className="mask mask-star-2 bg-secondary"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      className="mask mask-star-2 bg-secondary"
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      className="mask mask-star-2 bg-secondary"
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      className="mask mask-star-2 bg-secondary"
                    />
                  </div>
                  <span className="text-sm text-gray-500">121 Reviews</span>
                </div>
                <div className="flex gap-2 items-center justify-between">
                  <div className="p-3 flex-1  font-bold text-base md:text-2xl">
                    347.99 RWF
                  </div>
                  <div className="flex items-center gap-2">
                    <AddVariationsForm product={product as any} />
                    {/* <button className="btn btn-sm md:btn-md btn-primary text-sm">
                      <MdAddBox /> Add Variations
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SellerProductList;
