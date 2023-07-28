/* eslint-disable @next/next/no-img-element */
import { Category, Product, ProductAsset, Shop } from '@prisma/client';
import Link from 'next/link';
import React from 'react';
import { MdAddShoppingCart, MdFavorite } from 'react-icons/md';
import AddToCartForm from './forms/AddToCartForm';

const ProductList = ({ products }: { products: Product[] }) => {
  return (
    <div className="flex flex-wrap md:grid md:grid-cols-2 xl:grid-cols-3 gap-3 justify-items-center p-2">
      {products.map((prod) => (
        <div key={prod.id} className="card w-96 bg-base-100 shadow-xl">
          <figure>
            <img
              src={
                ((prod as any).images as ProductAsset[]).find(
                  (img) => img.isMain
                )?.secureUrl ?? (prod as any).images[0].secureUrl
              }
              alt={prod.name}
            />
          </figure>
          <div className="card-body">
            <div className="my-1 flex">
              <span className="font-extrabold text-2xl">{prod.price} RWF</span>
            </div>
            <Link href={`/products/${prod.id}`} className="card-title">
              {prod.name}
              <span className="badge badge-secondary">NEW</span>
            </Link>
            <p>{prod.description}</p>
            <div className="card-actions justify-end">
              {((prod as any).categories as Category[]).map((cat) => (
                <div key={cat.id} className="badge badge-outline">
                  {cat.name}
                </div>
              ))}
            </div>
            {(prod as any).shop && (
              <div className="my-2 flex items-center gap-3 ">
                <div className="text-xl text-secondary italic">From: </div>
                <span className="btn font-bold btn-outline">
                  {((prod as any).shop as Shop).name}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 p-1">
              <button className="btn btn-accent  btn-outline text-xl btn-circle">
                <MdFavorite />
              </button>
              <AddToCartForm product={prod} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
