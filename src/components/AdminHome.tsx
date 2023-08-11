import prisma from '@/prima';
import React from 'react';
import { MdMenu } from 'react-icons/md';
import AddCategoryForm from './forms/AddCategoryForm';
import CategoryList from './CategoryList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ShopList from './server/ShopList';
import { FaHome, FaShoppingCart, FaMoneyBillAlt } from 'react-icons/fa';
import { FaProductHunt, FaFan, FaUser, FaChartBar } from 'react-icons/fa6';
import DashboardSideBar, { SideBarItem } from './server/DashboardSideBar';

const AdminHome = async () => {
  const categories = await prisma.category.findMany({
    where: { parent: null },
    include: { image: true, subCategories: { include: { image: true } } },
  });
  const shops = await prisma.shop.findMany({
    include: {
      _count: { select: { followers: true } },
      category: true,
      image: true,
    },
  });
  const session = await getServerSession(authOptions);

  const items: SideBarItem[] = [
    {
      name: 'My Shop',
      icon: <FaHome />,
      link: '/dashboard',
      tooltip: 'Dashboard Home',
    },
    {
      icon: <FaProductHunt />,
      link: '#',
      name: 'Products',
      tooltip: 'My products',
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
        <div className="flex flex-col p-2">
          <div>
            <AddCategoryForm />
          </div>
          <CategoryList categories={categories} />
          <div></div>
          <div className="divider"></div>
          <ShopList shops={shops} user={session.user} />
          <div className="divider"></div>
          {/* <UsersTable users={users} /> */}
        </div>
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

export default AdminHome;
