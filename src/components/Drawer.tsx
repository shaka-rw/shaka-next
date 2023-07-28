/* eslint-disable @next/next/no-img-element */
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import {
  MdAccountCircle,
  MdArrowDropDown,
  MdCategory,
  MdDashboard,
  MdExplore,
  MdHome,
  MdLogin,
  MdMenu,
  MdSettings,
} from 'react-icons/md';
import LogoutBtn from './LogoutBtn';
import CartModal from './server/CartModal';

const Drawer = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="drawer">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content w-0">
        <label
          htmlFor="my-drawer-2"
          className="btn text-primary text-2xl drawer-button"
        >
          <MdMenu />
        </label>
      </div>
      <div className="drawer-side z-20">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu gap-3  p-4 w-60 flex-1 text-lg h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}

          <li>
            <Link href="/" className="p-2 flex gap-2 ">
              <MdHome /> Home
            </Link>
          </li>

          <li>
            <Link href="/discover" className="flex gap-2 p-2">
              <MdExplore /> Discover{' '}
            </Link>
          </li>
          <div className="divider"></div>
          <li>
            <a className="flex gap-2 p-2">
              <MdCategory /> Categories
            </a>
          </li>
          <li>
            <a className="flex gap-2 p-2">
              <MdAccountCircle /> Account{' '}
            </a>
          </li>
          {/* <div className="flex-1" /> */}
          <div className="block">
            {/* <div className="form-control w-full">
              <input
                type="text"
                className="input w-full input-bordered"
                placeholder="Search shaka"
              />
            </div> */}
            {/* <ul className="menu menu-horizontal gap-2 px-1">
              <li>
                <Link
                  href={'/api/auth/signin'}
                  className="btn btn-primary  normal-case text-lg"
                >
                  Login <MdLogin />
                </Link>
              </li>
              <li>
                <Link
                  href={'/auth/signup'}
                  className="btn  normal-case btn-outline text-lg"
                >
                  Signup <AiOutlineUserAdd />
                </Link>
              </li>
            </ul> */}
          </div>
          <div className="block">
            {session?.user ? (
              <>
                <ul tabIndex={0} className="flex flex-col gap-1 z-[1]">
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
                    <LogoutBtn />
                  </li>
                </ul>
              </>
            ) : (
              <ul className="menu menu-horizontal items-stretch gap-2 px-1">
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
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
