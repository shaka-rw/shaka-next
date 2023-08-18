/* eslint-disable @next/next/no-img-element */
import { Asset } from '@prisma/client';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { MdAddShoppingCart, MdEmojiObjects, MdFavorite } from 'react-icons/md';
import AddToCartForm from '../forms/AddToCartForm';
import AddVariationsForm, {
  VariationProduct,
} from '../forms/AddVariationsForm';
import EditProductForm from '../forms/EditProductForm';
import prisma from '@/prima';

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

export const NewDynamicProductList = async ({
  isDiscover = false,
  title,
  link,
  isSeller = false,
  products,
  className,
}: {
  products: VariationProduct[];
  title?: ReactNode;
  link?: ReactNode;
  className?: string;
  isSeller?: boolean;
  isDiscover?: boolean;
}) => {
  const sizes = isSeller ? await prisma.productSize.findMany({ take: 50 }) : [];
  return (
    <section className={`my-2`}>
      <div className="container flex-col flex gap-3 mx-auto px-2">
        <div className="flex gap-2 justify-between">
          {title && <>{title}</>}
          {link && <>{link}</>}
        </div>
        {products.length === 0 && (
          <div className="flex justify-center items-center min-h-max w-full p-4">
            <div className="alert alert-info flex gap-2">
              <MdEmojiObjects /> No products found.
            </div>
          </div>
        )}
        <div
          className={`grid md:flex flex-wrap xl:w-full mx-auto justify-items-start justify-start grid-cols-2 ${
            className ?? ''
          }  md:grid-cols-4 lg:grid-cols-5 gap-2 py-4`}
        >
          {products.map(async (product, i) => {
            const minPrice = Math.min(
              ...product.quantities.map((q) => q.price)
            );
            const maxPrice = Math.max(
              ...product.quantities.map((q) => q.price)
            );

            const productCategories = await prisma.category.findMany({
              where: { products: { some: { id: product.id } } },
            });
            const subCategories = await prisma.category.findMany({
              where: { parent: { shops: { some: { id: product.shopId } } } },
            });

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

                <div className="flex flex-col mt-2 gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-sm md:text-base"
                  >
                    {product.name}
                  </Link>
                  <div className="font-bold flex items-center gap-2 text-xs md:text-sm">
                    <span>{minPrice} RWF</span>
                    {maxPrice !== minPrice ? (
                      <>
                        {' '}
                        - <span>{maxPrice} RWF</span>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="divider my-1"></div>
                  <div className="card-actions justify-end">
                    <div className="flex items-center gap-1">
                      {!isSeller ? (
                        <button className="btn md:text-xl btn-sm md:btn-md btn-accent btn-outline btn-circle">
                          <MdFavorite />
                        </button>
                      ) : (
                        <>
                          {' '}
                          <EditProductForm
                            categories={subCategories}
                            productCategories={productCategories}
                            sizes={sizes}
                            product={product as any}
                          />{' '}
                        </>
                      )}
                      {isSeller ? (
                        <>
                          <AddVariationsForm product={product as any} />
                        </>
                      ) : (
                        <AddToCartForm product={product as any} />
                      )}
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

export default NewProductList;
