/* eslint-disable @next/next/no-img-element */
'use client';
import { Asset, Category } from '@prisma/client';
import React, { useRef } from 'react';
import {
  MdArrowCircleLeft,
  MdArrowCircleRight,
  MdCategory,
} from 'react-icons/md';

const CategoryBar = ({
  categories,
}: {
  categories: (Category & { image: Asset })[];
}) => {
  const scrollRef = useRef<HTMLElement>(null);

  const _categories: string[] = [
    'Electronics',
    'Clothing',
    'Shoes',
    'Home Decor',
    'Beauty',
    'Toys',
    'Sports',
    'Books',
    'Health',
    'Accessories',
    'Jewelry',
    'Gaming',
    'Furniture',
    'Pets',
    'Food',
    'Automotive',
    'Fitness',
    'Music',
    'Movies',
    'Stationery',
  ];

  const handleScrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollLeft -= 200; // Adjust the scrolling speed as needed
  };

  const handleScrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollLeft += 200; // Adjust the scrolling speed as needed
  };

  return (
    <div className="flex w-full items-center gap-1 md:gap-2 overflow-x-auto bg-base-300 p-2 md:p-4">
      <button
        className="btn btn-sm  btn-circle text-xl"
        onClick={handleScrollLeft}
      >
        <MdArrowCircleLeft />
      </button>
      <div
        className="flex flex-1 w-full p-2 scroll-smooth rounded-md  gap-2 overflow-x-auto"
        ref={scrollRef as any}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className="btn flex gap-2 items-center [border-radius:0.475rem!important] shadow-md"
          >
            <div className="avatar border w-10 h-10 rounded-full text-2xl  justify-center items-center">
              {category.image ? (
                <img
                  src={category.image.secureUrl}
                  alt={category.name}
                  className="max-w-full max-h-full object-contain object-center"
                />
              ) : (
                <MdCategory />
              )}
            </div>
            <span className="text-sm inline-block">{category.name}</span>
          </div>
        ))}
      </div>
      <button
        className="btn btn-sm btn-circle text-xl"
        onClick={handleScrollRight}
      >
        <MdArrowCircleRight />
      </button>
    </div>
  );
};

export default CategoryBar;
