import { Category } from '@prisma/client';
import React from 'react';
import { MdCategory, MdEmojiObjects } from 'react-icons/md';

const CategoryList = ({ categories }: { categories: Category[] }) => {
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
      <div className="flex flex-wrap items-center gap-2 p-2">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="btn card  border card-side bg-base-100"
          >
            <figure>
              <MdCategory />
            </figure>
            <div className="card-body p-2">
              <h2 className="card-title">{cat.name}</h2>
              {/* <div className="card-actions justify-end">
          <button className="btn btn-primary">Watch</button>
        </div> */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryList;
