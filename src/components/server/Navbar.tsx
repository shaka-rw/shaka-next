/* eslint-disable jsx-a11y/alt-text */
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

const Navbar = async ({ notHome: isNotHome = true }: { notHome?: boolean }) => {
  const session = await getServerSession(authOptions);
  const user = session?.user
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;
  const pathname = await getPath();

  return (
    <>
      <div className="btm-nav md:hidden text-primary border-t max-w-full w-full border-secondary z-10">
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

      <header
        className={`navbar z-10 hidden md:flex items-center top-0 bottom-auto left-0 ring-0 h-[60px] justify-between ${
          isNotHome
            ? ' border-b shadow-sm bg-base-100 [color:hsl(var(--bc)_/_var(--tw-text-opacity))!important] '
            : ' bg-transparent bg-gradient-to-b from-black to-transparent absolute '
        }`}
      >
        <div className="container items-center navbar w-full justify-between mx-auto">
          <ul className="flex-1 gap-2 hidden md:flex">
            <li>
              <CategoryDropDown notHome={isNotHome} />
            </li>
            <li>
              <Link
                href="/discover"
                className={`${
                  pathname.startsWith('/discover')
                    ? 'bg-[hsl(var(--b3)_/_var(--tw-bg-opacity))]'
                    : ''
                } btn rounded-3xl btn-outline tex btn-sm ${
                  isNotHome
                    ? '  '
                    : ' border-base-100 text-base-100 hover:bg-base-100/20 '
                }`}
              >
                <MdExplore />
                Discover
              </Link>
            </li>
            {session?.user && session?.user?.role !== 'CUSTOMER' && (
              <li>
                <Link
                  href="/dashboard"
                  className={`${
                    pathname.startsWith('/dashboard')
                      ? 'bg-[hsl(var(--b3)_/_var(--tw-bg-opacity))]'
                      : ''
                  } btn rounded-3xl btn-outline tex btn-sm ${
                    isNotHome
                      ? '  '
                      : ' border-base-100 text-base-100 hover:bg-base-100/20 '
                  }`}
                >
                  <MdDashboard />
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
          <Link href={'/'} className="hidden md:inline-block flex-none">
            <span className="">
              <Image
                alt={'Shaka'}
                width={80}
                height={60}
                className="h-[60px] mt-1"
                src={'/logo_.png'}
              />
            </span>
          </Link>
          <ul className="flex w-full md:w-auto justify-between gap-1  md:justify-end flex-1 items-center">
            <li>
              <Link href={'/'} className="inline-block md:hidden flex-none">
                <span className="">
                  <Image
                    alt={'Shaka'}
                    width={80}
                    height={60}
                    className="h-[60px] mt-1"
                    src={'/logo_.png'}
                  />
                </span>
              </Link>
            </li>
            <ul className="flex items-center flex-row gap-2">
              {!session?.user && process.env.NODE_ENV === 'development' && (
                <li>
                  <ThemeButton />
                </li>
              )}
              <li>
                <Link
                  href="#"
                  className={`btn btn-sm bg-transparent border-0 btn-square font-extrabold text-xl ${
                    isNotHome ? '  ' : ' text-base-100 hover:text-base-content '
                  }`}
                >
                  <MdSearch />
                </Link>
              </li>
            </ul>
            <ul className="flex items-center ml-1 gap-1">
              <li>
                <CartModal notHome={false} />
              </li>
              {session?.user && user ? (
                <>
                  <li>
                    <a
                      href="#"
                      className={`btn btn-sm bg-transparent border-0 btn-square font-extrabold text-xl ${
                        isNotHome
                          ? '  '
                          : ' text-base-100 hover:text-base-content '
                      }`}
                    >
                      <MdFavorite />
                    </a>
                  </li>

                  <li className="dropdown dropdown-bottom dropdown-end">
                    <label
                      tabIndex={0}
                      className={`btn btn-outline py-1 rounded-3xl text-sm ${
                        isNotHome
                          ? '  '
                          : ' items-center border-base-100 text-base-100 hover:bg-base-100/20 '
                      }`}
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
                      {process.env.NODE_ENV === 'development' && (
                        <>
                          <li>
                            <Link href={'#'}>
                              <MdSettings /> Settings
                            </Link>
                          </li>
                          <li>
                            <Themes />
                          </li>
                        </>
                      )}
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
                      className={`btn btn-sm bg-transparent border-0 btn-square font-extrabold text-xl ${
                        isNotHome
                          ? '  '
                          : ' items-center text-xl justify-center text-base-100 hover:text-base-content '
                      }`}
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
                </>
              )}
            </ul>
          </ul>
        </div>
      </header>
    </>
  );
};

export default Navbar;
