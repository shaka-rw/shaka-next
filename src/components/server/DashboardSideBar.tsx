import Link from 'next/link';
import React from 'react';

export type SideBarItem = {
  name: string;
  icon: React.ReactNode;
  link: string;
  tooltip?: string;
};

const DashboardSideBar = ({ items }: { items: SideBarItem[] }) => {
  return (
    <ul className="menu bg-base-200 w-48 md:w-60 xl:w-72 gap-3 rounded-box">
      {items.map((item) => (
        <li key={item.name}>
          <Link
            href={item.link}
            className={` text-base ${
              item.tooltip
                ? ' flex items-center gap-2 before:z-20 after:z-20 '
                : ''
            } `}
            data-tip={item.tooltip ?? ''}
          >
            {item.icon}
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default DashboardSideBar;
