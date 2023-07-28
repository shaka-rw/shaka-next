import { approveShop } from '@/app/_actions';
import { Shop, User } from '@prisma/client';
import React from 'react';
import { MdEmojiObjects, MdShop, MdCheck } from 'react-icons/md';

const ShopList = ({ shops, user }: { user: User; shops: Shop[] }) => {
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
      <div className="flex items-stretch gap-2 p-2">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="card flex items-center px-3 border card-side bg-base-100"
          >
            <figure className="w-10 flex justify-center items-center h-w-10">
              <MdShop />
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
    </>
  );
};

export default ShopList;
