'use client';
import React, { useRef } from 'react';
import { MdArrowCircleLeft, MdArrowCircleRight } from 'react-icons/md';

const CategoryBar = () => {
  const scrollRef = useRef<HTMLElement>(null);

  const categories: string[] = [
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
    <div className="flex items-center gap-1 md:gap-2 overflow-x-auto bg-base-300 p-2 md:p-4">
      <button
        className="btn btn-sm  btn-circle text-xl"
        onClick={handleScrollLeft}
      >
        <MdArrowCircleLeft />
      </button>
      <div
        className="flex p-2 scroll-smooth rounded-md  join join-horizontal overflow-x-auto"
        ref={scrollRef as any}
      >
        {categories.map((category) => (
          <div key={category} className="btn join-item shadow-md">
            {category}
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
