import Link from '@/components/server/Link';
import React from 'react';
import { MdAccountCircle, MdCategory, MdExplore, MdHome } from 'react-icons/md';

const Sidebar = () => {
  return (
    <div className="hidden lg:flex">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <ul className="menu gap-3  p-4 w-60 flex-1 text-lg h-full bg-base-100 border-r text-base-content">
        {/* Sidebar content here */}

        <li>
          <Link href="/" className="p-2 flex gap-2 ">
            <MdHome /> Home
          </Link>
        </li>

        <li>
          <Link href="/" className="flex gap-2 p-2">
            <MdExplore /> Discover{' '}
          </Link>
        </li>
        <div className="divider"></div>
        <li>
          <Link href="/" className="flex gap-2 p-2">
            <MdCategory /> Categories
          </Link>
        </li>
        <li>
          <Link href="/" className="flex gap-2 p-2">
            <MdAccountCircle /> Account{' '}
          </Link>
        </li>
        <div className="flex-1" />
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
              <Link href="/" className="btn btn-primary normal-case text-lg">
                Login
              </Link>
            </li>
            <li>
              <Link href="/" className="btn btn-outline normal-case text-lg">
                Signup
              </Link>
            </li>
          </ul> */}
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;
