/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import prisma from '@/prima';
import { Shop, User } from '@prisma/client';
import React from 'react';
import AddShopForm from './forms/AddShopForm';
import AddProductForm from './forms/AddProductForm';
import { approveShop } from '@/app/_actions';
import { MdEmojiObjects, MdShop, MdCheck, MdMenu } from 'react-icons/md';
import ProductList from './ProductList';
import DashboardSideBar, { SideBarItem } from './server/DashboardSideBar';
import { FaProductHunt, FaFan } from 'react-icons/fa6';
import {
  FaHome,
  FaShoppingCart,
  FaUser,
  FaMoneyBillAlt,
  FaChartBar,
} from 'react-icons/fa';
import { NewDynamicProductList } from './server/NewProductList';
import SellerProductList from './server/SellerProductList';

const SellerHome = async ({ user }: { user: User }) => {
  const shop = await prisma.shop.findFirst({
    where: { userId: user.id },
    include: {
      _count: { select: { followers: true, products: true } },
      category: true,
      image: true,
      owner: true,
    },
  });

  const categories = await prisma.category.findMany();
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
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 lg:p-10 border mb-3 border-gray-200">
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
                {/* <p className="text-gray-600">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Esse, dolores?
                </p> */}
              </div>

              <div className="flex justify-center gap-2">
                <div className="flex flex-col justify-between items-start p-4 border border-primary rounded-lg shadow-sm bg-base-200">
                  <p className="text-xs uppercase  font-semibold mb-1 text-accent">
                    Approval Status
                  </p>
                  <p className="font-extrabold text-lg md:text-2xl text-gray-600">
                    {shop.approved ? 'Approved' : 'Pending Approval'}
                  </p>
                </div>

                <div className="flex flex-col justify-between items-start p-4 border border-primary rounded-lg shadow-sm bg-base-200">
                  <p className="text-xs uppercase  font-semibold  mb-1 text-accent ">
                    Followers
                  </p>
                  <p className="font-extrabold text-3xl text-gray-600">
                    {shop._count.followers}
                  </p>
                </div>

                <div className="flex flex-col justify-between items-start p-4 border border-primary rounded-lg shadow-sm bg-base-200">
                  <p className="text-xs uppercase  font-semibold mb-1 text-accent">
                    Products
                  </p>
                  <p className="font-extrabold text-3xl text-gray-600">
                    {shop._count.products}
                  </p>
                </div>

                {/* Add more relevant shop information here */}
              </div>
            </div>
            {shop.approved ? (
              <AddProductForm shopId={shop.id} categories={categories} />
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
        {/* <ProductList products={products} /> */}
        <SellerProductList products={products} />
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

// function ShopProfile({ shop }: { shop: Shop }) {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 mb-4 md:p-8 lg:p-10">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl font-semibold">{shop.name}</h2>
//         <p className="text-gray-500">
//           Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate,
//           praesentium?
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="flex flex-col items-center md:border-r md:pr-4">
//           <p className="text-xl font-semibold">Approved Status</p>
//           <p className="text-gray-600">
//             {shop.approved ? 'Approved' : 'Pending Approval'}
//           </p>
//         </div>

//         <div className="flex flex-col items-center">
//           <p className="text-xl font-semibold">Number of Followers</p>
//           <p className="text-gray-600">{}</p>
//         </div>

//         <div className="flex flex-col items-center md:border-t md:pt-4">
//           <p className="text-xl font-semibold">Number of Products</p>
//           <p className="text-gray-600">{}</p>
//         </div>

//         {/* Add more relevant shop information here */}
//       </div>
//     </div>
//   );
// }

export default SellerHome;
