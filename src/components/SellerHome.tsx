/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import prisma from '@/prima';
import { Shop, User } from '@prisma/client';
import React from 'react';
import AddShopForm from './forms/AddShopForm';
import AddProductForm from './forms/AddProductForm';
import { approveShop } from '@/app/_actions';
import {
  MdEmojiObjects,
  MdShop,
  MdCheck,
  MdMenu,
  MdError,
  MdPeople,
  MdList,
} from 'react-icons/md';
import DashboardSideBar, { SideBarItem } from './server/DashboardSideBar';
import { FaFan } from 'react-icons/fa6';
import {
  FaHome,
  FaShoppingCart,
  FaUser,
  FaMoneyBillAlt,
  FaChartBar,
} from 'react-icons/fa';
import { NewDynamicProductList } from './server/NewProductList';
import { notFound } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

const SellerHome = async () => {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      cart: { include: { quantities: { include: { productQuantity: true } } } },
    },
  });

  const shop = await prisma.shop.findFirst({
    where: { userId: user?.id as string },
    include: {
      _count: { select: { followers: true, products: true } },
      category: true,
      image: true,
      owner: true,
    },
  });

  if (!shop) return notFound();

  const categories = await prisma.category.findMany({
    take: 30,
    where: { parent: null },
  });
  const subCategories = await prisma.category.findMany({
    take: 30,
    where: { parentId: shop?.categoryId },
  });

  const products = await prisma.product.findMany({
    where: { shopId: shop?.id as string },
    include: {
      categories: true,
      shop: true,
      colors: { include: { mainImage: true } },
      sizes: true,
      quantities: {
        include: { color: { include: { mainImage: true } }, size: true },
      },
      mainImage: true,
    },
  });

  const items: SideBarItem[] = [
    {
      name: 'My Shop',
      icon: <FaHome />,
      link: '/dashboard',
      tooltip: 'Dashboard Home',
    },
    {
      name: 'Orders',
      icon: <FaShoppingCart />,
      link: '/dashboard/orders',
      tooltip: 'View Orders',
    },
    {
      icon: <FaFan />,
      link: '#',
      name: 'Followers',
      tooltip: 'Followers',
    },
    {
      name: 'Customers',
      icon: <FaUser />,
      link: '/dashboard/customers',
      tooltip: 'Manage Customers',
    },
    {
      name: 'Payments',
      icon: <FaMoneyBillAlt />,
      link: '/dashboard/payments',
      tooltip: 'View Payments',
    },
    {
      name: 'Analytics',
      icon: <FaChartBar />,
      link: '/dashboard/analytics',
      tooltip: 'View Analytics',
    },
  ];

  return (
    <div className="drawer md:drawer-open">
      <input type="checkbox" id="drawer" className="drawer-toggle" />

      <div className="drawer-content p-2">
        {shop ? (
          <>
            <div className="rounded-lg shadow-lg p-6 md:p-8 lg:p-10 border mb-3 border-gray-200">
              <div className="text-center mb-6">
                <div className="avatar border overflow-hidden w-52 h-52 rounded-full mb-3">
                  <img
                    src={shop.image.secureUrl}
                    alt={shop.name}
                    className="object-contain w-full h-full"
                  />
                </div>
                <h2 className="text-3xl font-semibold text-accent">
                  {shop.name}
                </h2>
              </div>
              <div className="flex justify-center">
                <div className="stats stats-vertical md:stats-horizontal max-w-3xl mx-auto w-full ">
                  <div className="stat">
                    <div className="stat-figure text-accent">
                      {shop.approved ? <MdCheck /> : <MdError />}
                    </div>
                    <div className="stat-title">Approve status</div>
                    <div className="stat-value">
                      {shop.approved ? 'YES' : 'NO'}
                    </div>
                    <div className="stat-desc">
                      {shop.approved ? 'Approved' : 'Not approved'} by admins
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure text-accent">
                      <MdPeople />
                    </div>
                    <div className="stat-title">Followers</div>
                    <div className="stat-value">{shop._count.followers}</div>
                    <div className="stat-desc">No new followers today</div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-accent">
                      <MdList />
                    </div>
                    <div className="stat-title">Products</div>
                    <div className="stat-value">{shop._count.products}</div>
                    <div className="stat-desc">50% sold in 1 month</div>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>
            <div className="divider" />
            {shop.approved ? (
              <AddProductForm shopId={shop.id} categories={subCategories} />
            ) : (
              <div className="text-xl font-bold text-accent my-1 ">
                You can add products once your shop is approved
              </div>
            )}
          </>
        ) : (
          <>
            <AddShopForm categories={categories} />
          </>
        )}

        <div className="divider"></div>
        <div>
          <h3 className="font-bold m-2 mt-3 text-2xl uppercase">My Products</h3>
        </div>
        {products.length === 0 && (
          <div className="alert  flex gap-2">
            <MdEmojiObjects /> No products added yet.
          </div>
        )}

        <NewDynamicProductList products={products} isSeller />
      </div>

      <div className="drawer-side">
        <label htmlFor="drawer" className="drawer-overlay"></label>
        <div className="bg-base-200 h-full">
          <DashboardSideBar items={items.slice(0, 3)} />
          <div className="divider"></div>
          <DashboardSideBar items={items.slice(3, 5)} />
          <div className="divider"></div>
          <DashboardSideBar items={items.slice(5)} />
        </div>
      </div>
    </div>
  );
};

export default SellerHome;
