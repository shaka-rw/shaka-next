import prisma from '@/prima';
import React from 'react';
import { MdCategory, MdCheck, MdEmojiObjects, MdShop } from 'react-icons/md';
import AddCategory from './forms/AddCategory';
import AddShopForm from './forms/AddShopForm';
import { approveShop } from '@/app/_actions';
import CategoryList from './CategoryList';
import UsersTable from './server/UsersTable';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ShopList from './server/ShopList';

const AdminHome = async () => {
  const categories = await prisma.category.findMany();
  const shops = await prisma.shop.findMany();
  const users = await prisma.user.findMany();
  const session = await getServerSession(authOptions);
  return (
    <div className="flex flex-col p-3">
      <div>
        <AddCategory />
      </div>
      <CategoryList categories={categories} />
      <div>{/* <AddShopForm categories={categories} /> */}</div>
      <div className="divider"></div>
      <ShopList shops={shops} user={session.user} />
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
