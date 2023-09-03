import React from 'react';
import { MdOutlineWindow } from 'react-icons/md';
import { FaCaretRight } from 'react-icons/fa6';
import { getPath } from '@/app/_actions';
import prisma from '@/prima';
import Link from 'next/link';

// interface Category {
//   name: string;
//   subCategories: SubCategory[];
// }

// interface SubCategory {
//   name: string;
// }

// Sample data for categories and subcategories

const CategoryDropDown = async ({ notHome = true }: { notHome?: boolean }) => {
  const categories = await prisma.category.findMany({
    take: 50,
    where: { parent: null },
    include: { subCategories: true },
  });

  return (
    <div className="dropdown z-10 dropdown-end">
      <label
        tabIndex={0}
        className={`btn rounded-3xl btn-outline tex btn-sm ${
          notHome
            ? '  '
            : ' border-base-100 text-base-100 hover:bg-base-100/20 '
        } `}
      >
        <MdOutlineWindow /> All Categories
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-10 left-2 menu p-2 shadow bg-base-100 rounded-box w-fit min-w-[13rem]"
      >
        {categories.map((cat) => (
          <div key={cat.name} className="group/cat dropdown dropdown-right">
            <label
              tabIndex={0}
              className="btn flex-nowrap justify-between capitalize text-sm w-full my-1"
            >
              {cat.name.slice(0, 20)}
              <FaCaretRight />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content left-[104%] m-0 hidden group-focus-within/cat:[display:flex] z-[1] menu p-2 shadow bg-base-100 rounded-box w-fit"
            >
              {cat.subCategories.map((subCat) => (
                <li key={subCat.name}>
                  <Link
                    className="bg-base-100 text-base-content"
                    href={`/discover/?cat=${subCat.id}`}
                  >
                    {subCat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default CategoryDropDown;
