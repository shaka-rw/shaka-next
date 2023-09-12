/* eslint-disable @next/next/no-img-element */
import Link from '@/components/server/Link';
import Image from 'next/image';
import React from 'react';
import {
  MdAccountCircle,
  MdArrowDropDown,
  MdDashboard,
  MdLogin,
  MdSettings,
  MdShoppingCart,
} from 'react-icons/md';
import Drawer from './Drawer';
import { getServerSession } from 'next-auth';
import LogoutBtn from './LogoutBtn';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AiOutlineUserAdd } from 'react-icons/ai';
import prisma from '@/prisma';
import CartModal from './server/CartModal';
import Themes from './client/Themes';

const AppBar = async () => {
  const session = await getServerSession(authOptions);

  //   if (!session) {
  //     redirect('/api/auth/signin?callbackUrl=/');
  //   }

  return (
    <div className="navbar h-12 mb-5 items-center bg-base-200 col-span-2 border-b gap-2 p-1 justify-between">
      <div className="container flex justify-between mx-auto max-w-7xl">
        <div className="inline-flex justify-start items-center text-xl">
          <Drawer />
          <Link href="/" className=" normal-case ">
            <Image
              alt="Shaka"
              width={120}
              height={60}
              src="/logo_.png"
              className="flex justify-center items-center"
            />
          </Link>
        </div>
        <div className="flex-1 w-full max-w-2xl">
          <div className="form-control w-full">
            <input
              type="text"
              className="input w-full input-bordered"
              placeholder="Search shaka"
            />
          </div>
        </div>
        {session?.user && <CartModal />}
        <div className="flex-none hidden md:block">
          {session?.user ? (
            <>
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn flex items-center bg-white/20 rounded-lg gap-2 p-1 px-2 border"
                >
                  <span className="avatar w-10 h-10">
                    {session.user.image ? (
                      <img
                        alt={session.user.name ?? ''}
                        src={session.user.image}
                        className="rounded-full"
                      />
                    ) : (
                      <MdAccountCircle />
                    )}
                  </span>
                  <span className="avatar">
                    {session.user.name?.split(' ')[0]}
                  </span>
                  <span>
                    <MdArrowDropDown className="text-2xl" />
                  </span>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content flex flex-col gap-1 z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {session.user.role !== 'CUSTOMER' && (
                    <li>
                      <Link href={'/dashboard'} className="flex gap-2">
                        <MdDashboard /> Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link href={'#'} className="flex gap-2">
                      <MdAccountCircle /> Profile
                    </Link>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <Link href={'#'}>
                      <MdSettings /> Settings
                    </Link>
                  </li>
                  <li>
                    <Themes />
                  </li>
                  <li>
                    <LogoutBtn />
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <ul className="menu menu-horizontal gap-2 px-1">
              <li>
                <Link
                  href={'/api/auth/signin'}
                  className="btn btn-primary  normal-case text-lg"
                >
                  Login <MdLogin />
                </Link>
              </li>
              {/* <li>
                <Link
                  href={'/auth/signup'}
                  className="btn  normal-case btn-outline text-lg"
                >
                  Signup <AiOutlineUserAdd />
                </Link>
              </li> */}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppBar;
