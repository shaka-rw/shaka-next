/* eslint-disable @next/next/no-img-element */
import { Asset, Category } from '@prisma/client';
import React from 'react';
import { MdEmojiObjects, MdMoreVert } from 'react-icons/md';
import AddCategoryForm from './forms/AddCategoryForm';
import { FaCaretDown } from 'react-icons/fa';
import EditCategoryForm from './forms/EditCategoryForm';
import DeleteCategoryForm from './forms/DeleteCategoryForm';

export type CategoryWithSubs = Category & {
  image: Asset;
  subCategories: (Category & { image: Asset })[];
};

const CategoryList = ({
  categories: cats,
}: {
  categories: CategoryWithSubs[];
}) => {
  let categories = cats.reverse();
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
      <div className="flex flex-wrap items-center gap-2 p-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className=" flex gap-1 p-1 border rounded-md items-center "
          >
            <div className="dropdown dropdown-bottom">
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
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] flex flex-col p-2 shadow bg-base-100 border rounded-box min-w-[13rem]"
              >
                {cat.subCategories.map((sCat, i) => (
                  <li
                    key={sCat.id}
                    className={`flex justify-between items-center gap-2 py-2 ${
                      i !== 0 ? 'border-t' : ''
                    }`}
                  >
                    <div className="inline-flex gap-1 items-center">
                      <div className="avatar overflow-hidden rounded-full h-8 w-8 border">
                        <img
                          src={sCat.image.secureUrl}
                          alt={sCat.name}
                          className="w-full object-contain h-full"
                        />
                      </div>
                      <span className="font-semibold text-sm">{sCat.name}</span>
                    </div>
                    <div className="ml-1 justify-self-end ">
                      <div className="flex gap-1 items-center">
                        <EditCategoryForm category={sCat} />
                        <DeleteCategoryForm category={sCat} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="divider divider-vertical" />
            <div className="dropdown dropdown-end">
              <label className="btn btn-ghost btn-sm btn-square" tabIndex={0}>
                <MdMoreVert />
              </label>
              <div className="dropdown-content min-w-max z-[1] flex flex-col p-2 shadow bg-base-100 border rounded-box">
                <div className="flex items-center gap-2 py-1 border-b">
                  <AddCategoryForm parent={cat} />
                </div>
                <div className="flex items-center border-b gap-2 py-1">
                  <EditCategoryForm category={cat} />
                </div>
                <div className="flex items-center gap-2 py-1">
                  <DeleteCategoryForm category={cat} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* </HorizontalScroll> */}
    </>
  );
};

export default CategoryList;
