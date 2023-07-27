import prisma from '@/prima';
import React from 'react';
import { MdCategory, MdCheck, MdEmojiObjects, MdShop } from 'react-icons/md';
import AddCategory from './forms/AddCategory';
import AddShopForm from './forms/AddShopForm';
import { approveShop } from '@/app/_actions';
import CategoryList from './CategoryList';
import UsersTable from './server/UsersTable';

const AdminHome = async () => {
  const categories = await prisma.category.findMany();
  const shops = await prisma.shop.findMany();
  const users = await prisma.user.findMany();
  return (
    <div className="flex flex-col p-3">
      <div>
        <AddCategory />
      </div>
      <CategoryList categories={categories} />
      <div>{/* <AddShopForm categories={categories} /> */}</div>
      <div className="divider"></div>
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
              {!shop.approved && (
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
      <div className="divider"></div>
      <div>
        <h3 className="font-bold m-2 mt-3 text-2xl uppercase">Users</h3>
      </div>
      {shops.length === 0 && (
        <div className="alert  flex gap-2">
          <MdEmojiObjects /> No users created yet.
        </div>
      )}
      <UsersTable users={users} />
    </div>
  );
};

export default AdminHome;
