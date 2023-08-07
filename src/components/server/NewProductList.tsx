/* eslint-disable @next/next/no-img-element */
import { Asset, Product } from '@prisma/client';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { MdAddShoppingCart, MdFavorite } from 'react-icons/md';
import AddToCartForm from '../forms/AddToCartForm';
import { VariationProduct } from '../forms/AddVariationsForm';

const NewProductList = ({ isDiscover = false }: { isDiscover?: boolean }) => {
  return (
    <section className={`${isDiscover ? 'my-4' : 'my-8'}`}>
      <div className="container flex-col flex gap-3 mx-auto px-3">
        <div className="flex gap-2 justify-between">
          <h2 className="text-lg font-semibold">
            {!isDiscover ? (
              'Top products'
            ) : (
              <div className="form-control w-full max-w-2xl">
                <input
                  type="search"
                  placeholder="Search here..."
                  className="input input-bordered w-full max-w-2xl"
                />
              </div>
            )}
          </h2>
          {!isDiscover && (
            <span className="link">Discover products &rarr;</span>
          )}
        </div>
        <div
          className={`grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-2 py-4`}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="max-w-xs flex flex-col bg-base-200 rounded-md p-3 gap-3"
            >
              <div className="avatar rounded justify-self-end self-end overflow-hidden h-52 w-full">
                <img
                  src={`/assets/imgs/products/product-${i + 1}-1.jpg`}
                  alt="Product"
                  className="object-contain object-center"
                />
              </div>
              <div className="flex flex-col mt-2 gap-2">
                <span className="text-sm text-gray-500">Ships to Kigali</span>
                <h3 className="text-lg font-semibold">Men stripped T-Shirt</h3>
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
                  <div className="p-3 font-bold text-base md:text-2xl">
                    347.99 RWF
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn md:text-xl btn-sm md:btn-md btn-secondary btn-outline btn-circle">
                      <MdFavorite />
                    </button>
                    <button className="btn btn-sm md:btn-md btn-primary  md:text-xl btn-circle">
                      <MdAddShoppingCart />
                    </button>
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

export const NewDynamicProductList = ({
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
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn md:text-xl btn-sm md:btn-md btn-secondary btn-outline btn-circle">
                      <MdFavorite />
                    </button>
                    <AddToCartForm product={product as any} />
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

export default NewProductList;
