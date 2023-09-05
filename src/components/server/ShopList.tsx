/* eslint-disable @next/next/no-img-element */
import { Asset, Category, Shop, User } from '@prisma/client';
import React from 'react';
import { MdCheck, MdClose, MdEmojiObjects } from 'react-icons/md';
import Link from 'next/link';
import Simplebar from '../client/SimpleBar';
import { approveShop, disApproveShop } from '@/app/_actions';

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
      <div className="container my-10 p-2 mx-auto ">
        <h3 className="text-2xl mb-5 font-bold">Shops</h3>
        {shops.length === 0 && (
          <div className="alert  flex gap-2">
            <MdEmojiObjects /> No shops created yet.
          </div>
        )}
        <Simplebar>
          <div className="grid max-w-full rounded-sm p-1 grid-rows-2 grid-flow-col gap-3">
            {shops.map((shop) => (
              <Link
                href={`/shops/${shop.id}`}
                key={shop.id}
                className="grid w-[300px] border border-transparent hover:border-primary cursor-pointer p-3 rounded-lg bg-base-200/50 items-center  gap-2 grid-cols-[auto,1fr,auto]"
              >
                <img
                  src={shop.image.secureUrl}
                  className="w-10 h-10 object-cover rounded-full"
                  alt={shop.name}
                />
                <span className="flex gap-1 flex-col">
                  <span className="text-sm font-semibold">{shop.name}</span>
                  <span className="text-xs h-4 w-full flex overflow-hidden text-base-content">
                    {shop.about}...
                  </span>
                </span>
                {user?.role === 'ADMIN' && (
                  <div className=" inline-flex justify-center items-center h-full">
                    <form
                      action={!shop.approved ? approveShop : disApproveShop}
                    >
                      <input type="hidden" name="shopId" value={shop.id} />
                      <button
                        type="submit"
                        className={`btn btn-sm ${
                          !shop.approved ? ' btn-primary ' : ' btn-error '
                        }`}
                      >
                        {!shop.approved ? <MdCheck /> : <MdClose />}
                        {!shop.approved ? 'Approve' : 'Dis-Approve'}
                      </button>
                    </form>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </Simplebar>
      </div>

      {/* <HorizontalScroll className="bg-transparent md:p-2 rounded">
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
                {user?.role === 'ADMIN' && (
                  <div className="card-actions justify-end">
                    <form
                      action={!shop.approved ? approveShop : disApproveShop}
                    >
                      <input type="hidden" name="shopId" value={shop.id} />
                      <button
                        type="submit"
                        className={`btn btn-sm ${
                          !shop.approved ? ' btn-primary ' : ' btn-error '
                        }`}
                      >
                        {!shop.approved ? <MdCheck /> : <MdClose />}
                        {!shop.approved ? 'Approve' : 'Dis-Approve'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </HorizontalScroll> */}
    </>
  );
};

export default ShopList;
