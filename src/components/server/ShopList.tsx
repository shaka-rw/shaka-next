/* eslint-disable @next/next/no-img-element */
import { approveShop } from '@/app/_actions';
import { Asset, Category, Shop, User } from '@prisma/client';
import React from 'react';
import { MdEmojiObjects, MdShop, MdCheck } from 'react-icons/md';
import HorizontalScroll from './HorizontalScroll';

export type ShopWithCategory = Shop & {
  image: Asset;
  category: Category;
};

const ShopList = ({
  shops,
  user,
}: {
  user: User;
  shops: ShopWithCategory[];
}) => {
  return (
    <>
      <div>
        <h3 className="font-bold m-2 mt-3 text-2xl uppercase">Shops</h3>
      </div>
      {shops.length === 0 && (
        <div className="alert  flex gap-2">
          <MdEmojiObjects /> No shops created yet.
        </div>
      )}

      <HorizontalScroll className="bg-transparent md:p-2 rounded">
        <div className="flex justify-center items-center gap-2 p-2">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="card flex items-center px-3 border card-side bg-base-100"
            >
              <figure className="w-10 flex justify-center items-center h-10">
                <div className="avatar overflow-hidden rounded-full h-10 w-10 border">
                  <img
                    src={shop.image.secureUrl}
                    alt={shop.name}
                    className="w-full object-contain h-full"
                  />
                </div>
              </figure>
              <div className="card-body p-2">
                <h2 className="card-title">{shop.name}</h2>
                {!shop.approved && user?.role === 'ADMIN' && (
                  <div className="card-actions justify-end">
                    <form action={approveShop}>
                      <input type="hidden" name="shopId" value={shop.id} />
                      <button type="submit" className="btn btn-sm btn-primary">
                        <MdCheck /> Approve
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </HorizontalScroll>
    </>
  );
};

export default ShopList;
