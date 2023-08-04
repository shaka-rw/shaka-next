import Link from 'next/link';
import React from 'react';
import {
  MdOutlineWindow,
  MdExplore,
  MdSearch,
  MdPerson,
  MdFavorite,
  MdShoppingCart,
} from 'react-icons/md';
import Image from 'next/image';

const Navbar = () => {
  return (
    <div className="navbar shadow-sm border-b ">
      <div className="navbar h-auto min-h-[auto] mx-auto flex-wrap justify-between gap-2 p-0">
        <ul className="flex-1">
          <li>
            <Link
              href="/"
              className="btn bg-transparent border-0 py-1 flex items-center gap-1"
            >
              <MdOutlineWindow /> All Categories
            </Link>
          </li>
          <li>
            <Link
              href="/discover"
              className="btn btn-ghost gap-2 bg-transparent border-0 py-1"
            >
              <MdExplore />
              Discover
            </Link>
          </li>
          <li>
            <a href="#" className="btn btn-ghost bg-transparent border-0 py-1">
              Orders
            </a>
          </li>
        </ul>
        <Link href={'/'} className="flex-none">
          <Image
            height={40}
            width={80}
            src="/logo.png"
            alt="Shaka"
            className=""
          />
        </Link>
        <ul className="flex justify-end flex-1 items-center">
          <li>
            <div className="btn mr-1 flex bg-transparent py-1  gap-2 [text-transform:unset] text-sm items-center">
              <MdSearch className="text-lg" />
              <span className="text-sm">Search</span>
            </div>
          </li>
          <li>
            <a
              href="#"
              className="btn btn-square bg-transparent border-0 text-lg [padding:.15rem!important]"
            >
              <MdPerson />
            </a>
          </li>
          <li>
            <a
              href="#"
              className="btn btn-square bg-transparent border-0 text-lg [padding:.15rem!important]"
            >
              <MdFavorite />
            </a>
          </li>
          <li>
            <a
              href="#"
              className="btn btn-square bg-transparent border-0 text-lg [padding:.15rem!important]"
            >
              <MdShoppingCart />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
