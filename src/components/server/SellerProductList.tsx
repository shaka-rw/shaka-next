/* eslint-disable @next/next/no-img-element */
import { Product, Asset } from '@prisma/client';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { MdFavorite, MdAddShoppingCart, MdAddBox } from 'react-icons/md';
import AddVariationsForm, { VariationProduct } from '../forms/AddVariationsForm';

export const SellerProductList = ({
  isDiscover = false,
  title,
  link,
  products,
  className,
}: {
  products: VariationProduct[];
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
          className={`grid md:flex flex-wrap xl:w-full mx-auto justify-items-start justify-start grid-cols-2 ${
            className ?? ''
          }  md:grid-cols-4 lg:grid-cols-5 gap-2 py-4`}
        >
          {products.map((product, i) => {
            const minPrice = Math.min(
              ...product.quantities.map((q) => q.price)
            );
            const maxPrice = Math.max(
              ...product.quantities.map((q) => q.price)
            );
            return (
              <div
                key={i}
                className="bg-base-200/25 md:min-w-[200px] w-full max-w-[230px] lg:w-[230px] flex flex-col justify-between md:justify-stretch card rounded-md p-2 gap-2 border"
              >
                <figure className="flex justify-center items-center rounded bg-base-200">
                  <div className="avatar rounded self-center justify-center overflow-hidden  w-36 h-36">
                    <img
                      src={((product as any).mainImage as Asset).secureUrl}
                      alt={product.name.slice(0, 10)}
                      className="object-contain object-center  w-36 h-36"
                    />
                  </div>
                </figure>
                <span className="text-xs font-light text-accent">
                  Ships to Kigali
                </span>
                <div className="flex flex-col mt-2 gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-sm md:text-base"
                  >
                    {product.name}
                  </Link>
                  <div className="font-bold flex items-center gap-2 text-xs md:text-sm">
                    <span>{minPrice} RWF</span> - <span>{maxPrice} RWF</span>
                  </div>
                  <div className="divider my-1"></div>
                  <div className="card-actions justify-end">
                    <div className="flex items-center gap-1">
                      <button className="btn md:text-xl btn-sm md:btn-md btn-accent btn-outline btn-circle">
                        <MdFavorite />
                      </button>
                      <AddVariationsForm product={product as any} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SellerProductList;
