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

const CategoryDropDown = async () => {
  const categories = await prisma.category.findMany({
    take: 50,
    where: { parent: null },
    include: { subCategories: true },
  });

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className={`btn bg-transparent m-1`}>
        <MdOutlineWindow /> All Categories
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] left-2 menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {categories.map((cat) => (
          <div key={cat.name} className="group/cat dropdown dropdown-right">
            <label tabIndex={0} className="btn justify-between w-full my-1">
              {cat.name}
              <FaCaretRight />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content left-[104%] m-0 hidden group-focus-within/cat:[display:flex] z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              {cat.subCategories.map((subCat) => (
                <li key={subCat.name}>
                  <Link href={`/discover/?cat=${subCat.id}`}>
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
