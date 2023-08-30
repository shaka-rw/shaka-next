/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import {
  MdExplore,
  MdSearch,
  MdPerson,
  MdLogin,
  MdFavorite,
  MdDashboard,
  MdHome,
  MdMenu,
  MdSettings,
  MdAccountCircle,
} from 'react-icons/md';
import { AiOutlineUserAdd } from 'react-icons/ai';

import Image from 'next/image';
import { getServerSession } from 'next-auth';
import CategoryDropDown from './CategoryDropDown';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/prima';
import { FaCaretDown } from 'react-icons/fa6';
import LogoutBtn from '../LogoutBtn';
import CartModal from './CartModal';
import { getPath } from '@/app/_actions';
import Themes, { ThemeButton } from '../client/Themes';
import Logo from '../client/Logo';
import { twMerge } from 'tailwind-merge';

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;
  const pathname = await getPath();

  return (
    <>
      <div className="btm-nav md:hidden text-primary border-t max-w-full w-full border-secondary z-10">
        {/* button */}
        <Link
          className={`w-fit ${pathname === '/' ? 'active' : ''}`}
          href={'/'}
        >
          <MdHome className="text-lg" />
          <span className="btm-nav-label text-xs font-semibold">Home</span>
        </Link>
        <Link
          className={`w-fit ${
            pathname.startsWith('/discover') ? 'active' : ''
          }`}
          href={'/discover'}
        >
          <MdExplore className="text-lg" />
          <span className="btm-nav-label text-xs font-semibold">Discover</span>
        </Link>
        {user && ['SELLER', 'ADMIN'].includes(user?.role ?? '') && (
          <Link
            className={`w-fit ${
              pathname.startsWith('/dashboard') ? 'active' : ''
            }`}
            href={'dashboard'}
          >
            <MdDashboard className="text-lg" />
            <span className="btm-nav-label text-xs font-semibold">
              Dashboard
            </span>
          </Link>
        )}
        <label htmlFor="drawer" className="md:hidden">
          <MdMenu />
          <span className="btm-nav-label text-xs font-semibold">Menu</span>
        </label>
      </div>

      <div className="navbar shadow-sm border-b ">
        <div className="navbar h-auto min-h-[auto] mx-auto flex-wrap justify-between gap-2 p-0">
          <ul className="flex-1 hidden md:flex">
            <li>
              <CategoryDropDown />
            </li>
            <li>
              <Link
                href="/discover"
                className={`btn btn-ghost gap-2 ${
                  pathname.startsWith('/discover')
                    ? 'bg-base-200'
                    : 'bg-transparent'
                } border-0 py-1`}
              >
                <MdExplore />
                Discover
              </Link>
            </li>
            {session?.user && session?.user?.role !== 'CUSTOMER' && (
              <li>
                <Link
                  href="/dashboard"
                  className={`btn btn-ghost gap-2 ${
                    pathname.startsWith('/dashboard')
                      ? 'bg-base-200'
                      : 'bg-transparent'
                  } border-0 py-1`}
                >
                  <MdDashboard />
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
          <Link href={'/'} className="hidden md:inline-block flex-none">
            <Logo width={80} height={40} />
          </Link>
          <ul className="flex w-full md:w-auto justify-between gap-1  md:justify-end flex-1 items-center">
            <li>
              <Link href={'/'} className="inline-block md:hidden flex-none">
                <Logo width={140} height={60} />
              </Link>
            </li>
            <ul className="flex flex-row gap-2">
              {!session?.user && (
                <li>
                  <ThemeButton />
                </li>
              )}
              {/* <div className="btn mr-1 flex bg-transparent py-1  gap-2 [text-transform:unset] text-sm items-center">
                <span className="text-sm">Search</span>
              </div> */}
              <li>
                <Link
                  href="#"
                  className="btn btn-square bg-transparent border-0 text-lg [padding:.15rem!important]"
                >
                  <MdSearch />
                </Link>
                {/* <div className="form-control relative w-full max-w-xs">
                  <MdSearch className="text-xl absolute top-1/2 left-2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search.."
                    className={twMerge(
                      'input input-sm md:input-md input-bordered w-full max-w-xs',
                      'pl-8 md:pl-8'
                    )}
                  />
                </div> */}
              </li>
            </ul>
            <ul className="flex items-center ml-1 gap-1">
              <li>
                <CartModal />
                {/* <a
                      href="#"
                      className="btn btn-square bg-transparent border-0 text-lg [padding:.15rem!important]"
                    >
                      <MdShoppingCart />
                    </a> */}
              </li>
              {session?.user && user ? (
                <>
                  <li>
                    <a
                      href="#"
                      className="btn btn-square bg-transparent border-0 text-lg [padding:.15rem!important]"
                    >
                      <MdFavorite />
                    </a>
                  </li>

                  <li className="dropdown dropdown-bottom dropdown-end">
                    <label
                      tabIndex={0}
                      className="btn gap-2 items-center btn-sm rounded-xl  border-0 text-lg h-10 w-[4.5rem] px-0 py-[.15rem]"
                    >
                      <span className="avatar p-1 w-8 h-8 overflow-hidden rounded-full">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name ?? ''}
                            className="object-contain rounded-full object-center w-full h-full"
                          />
                        ) : (
                          <MdPerson />
                        )}
                      </span>
                      <FaCaretDown />
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 border border-base-300 rounded-box w-52"
                    >
                      <li>
                        <a>{user.name}</a>
                      </li>
                      <li>
                        <Link href={'/dashboard/orders/customer'}>
                          My Orders
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
                  </li>
                </>
              ) : (
                <>
                  <li className="dropdown dropdown-end">
                    <label
                      tabIndex={0}
                      className="btn btn-square bg-transparent border-0 text-lg [padding:.15rem!important]"
                    >
                      <MdAccountCircle />
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 gap-2 shadow bg-base-100 border border-base-300 rounded-box w-52"
                    >
                      <li>
                        <Link
                          href={'/api/auth/signin'}
                          className="p-2 btn-primary btn btn-sm gap-2 "
                        >
                          <MdLogin /> Login
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={'/api/auth/signin'}
                          className="p-2 btn btn-secondary btn-outline btn-sm gap-2 "
                        >
                          <AiOutlineUserAdd /> Signup
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* <li>
                    <Link
                      href="/api/auth/signin"
                      className="btn flex-nowrap mx-1 btn-primary btn-sm md:btn-md text-xs  md:text-sm"
                    >
                      Login <MdLogin />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/api/auth/signin"
                      className="btn hidden md:inline-flex flex-nowrap mx-1 btn-secondary btn-sm md:btn-md btn-outline text-xs  md:text-sm"
                    >
                      Signup <AiOutlineUserAdd />
                    </Link>
                  </li> */}
                </>
              )}
            </ul>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
