/* eslint-disable @next/next/no-img-element */
import { Asset, Category } from '@prisma/client';
import React from 'react';
import { MdEmojiObjects } from 'react-icons/md';
import AddCategoryForm from './forms/AddCategoryForm';
import { FaCaretDown } from 'react-icons/fa';

export type CategoryWithSubs = Category & {
  image: Asset;
  subCategories: (Category & { image: Asset })[];
};

const CategoryList = ({ categories }: { categories: CategoryWithSubs[] }) => {
  return (
    <>
      <div>
        <h3 className="font-bold m-2 mt-3 text-2xl uppercase">Categories</h3>
      </div>
      {categories.length === 0 && (
        <div className="alert  flex gap-2">
          <MdEmojiObjects /> No categories yet.
        </div>
      )}
      {/* <HorizontalScroll className="bg-transparent md:p-2 rounded h-auto"> */}
      <div className="flex items-center gap-2 p-2">
        {categories.map((cat) => (
          <div key={cat.id} className="dropdown dropdown-bottom ">
            <div className="flex gap-2 p-1 border pr-2 rounded-md items-center">
              <label
                tabIndex={0}
                className="btn border-0 gap-2 items-center py-2 h-fit  bg-base-100"
              >
                <div className="avatar overflow-hidden rounded-full h-10 w-10 border">
                  <img
                    src={cat.image.secureUrl}
                    alt={cat.name}
                    className="w-full object-contain h-full"
                  />
                </div>
                <span className="font-semibold text-lg">{cat.name}</span>
                <FaCaretDown />
              </label>
              <div className="divider divider-vertical" />
              <AddCategoryForm parent={cat} />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] flex flex-col p-2 shadow bg-base-100 border rounded-box min-w-[13rem]"
            >
              {cat.subCategories.map((sCat, i) => (
                <li
                  key={sCat.id}
                  className={`flex items-center gap-2 py-2 ${
                    i !== 0 ? 'border-t' : ''
                  }`}
                >
                  <div className="avatar overflow-hidden rounded-full h-8 w-8 border">
                    <img
                      src={sCat.image.secureUrl}
                      alt={sCat.name}
                      className="w-full object-contain h-full"
                    />
                  </div>
                  <span className="font-semibold text-lg">{sCat.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* </HorizontalScroll> */}
    </>
  );
};

export default CategoryList;
