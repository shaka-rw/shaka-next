import React from 'react';
import { MdOutlineWindow } from 'react-icons/md';
import { FaCaretRight } from 'react-icons/fa6';

interface Category {
  name: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  name: string;
}

// Sample data for categories and subcategories
const categories: Category[] = [
  {
    name: 'Electronics',
    subCategories: [
      { name: 'Phones' },
      { name: 'Laptops' },
      { name: 'Tablets' },
    ],
  },
  {
    name: 'Clothing',
    subCategories: [{ name: 'Shirts' }, { name: 'Pants' }, { name: 'Dresses' }],
  },
  {
    name: 'Home',
    subCategories: [
      { name: 'Furniture' },
      { name: 'Decor' },
      { name: 'Appliances' },
    ],
  },
  {
    name: 'Sports',
    subCategories: [
      { name: 'Soccer' },
      { name: 'Basketball' },
      { name: 'Tennis' },
    ],
  },
  {
    name: 'Books',
    subCategories: [
      { name: 'Fiction' },
      { name: 'Non-Fiction' },
      { name: 'Science Fiction' },
    ],
  },
  {
    name: 'Beauty',
    subCategories: [
      { name: 'Skincare' },
      { name: 'Makeup' },
      { name: 'Haircare' },
    ],
  },
  {
    name: 'Toys',
    subCategories: [
      { name: 'Action Figures' },
      { name: 'Dolls' },
      { name: 'Board Games' },
    ],
  },
  {
    name: 'Food',
    subCategories: [
      { name: 'Snacks' },
      { name: 'Beverages' },
      { name: 'Canned Goods' },
    ],
  },
  {
    name: 'Garden',
    subCategories: [
      { name: 'Plants' },
      { name: 'Tools' },
      { name: 'Outdoor Furniture' },
    ],
  },
  {
    name: 'Pets',
    subCategories: [{ name: 'Dogs' }, { name: 'Cats' }, { name: 'Fish' }],
  },
];

const CategoryDropDown = () => {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn m-1">
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
                  <a>{subCat.name}</a>
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
