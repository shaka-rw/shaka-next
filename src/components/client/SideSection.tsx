'use client';

import useMobile from '@/hooks/useMobile';
import React, { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import { MdResetTv } from 'react-icons/md';

const SideSection = () => {
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const isMobile = useMobile();

  const genders = ['all', 'men', 'women'];
  const sizes = ['all', 'small', 'medium', 'large'];
  const prices = ['all', '$0 - $50', '$51 - $100', '$101 - $200', 'Over $200'];

  const handleGenderChange = (value: any) => setSelectedGender(value);
  const handleSizeChange = (value: any) => setSelectedSize(value);
  const handlePriceChange = (value: any) => setSelectedPrice(value);

  const handleResetFilters = () => {
    setSelectedGender('all');
    setSelectedSize('all');
    setSelectedPrice('all');
  };

  return (
    <div className="w-full flex flex-col gap-2 p-2 md:w-60 h-full">
      <div className="flex items-center justify-between gap-2">
        {!isMobile && (
          <h2 className="text-lg font-semibold md:mb-4">Discover</h2>
        )}
      </div>
      <div className={` ${isMobile ? 'flex gap-2 items-center ' : ''} `}>
        <div className={`${isMobile ? 'dropdown' : ''} mb-4 `}>
          <label
            tabIndex={0}
            className={`text-sm ${
              isMobile ? 'btn gap-2' : ''
            }  font-semibold mb-2`}
          >
            {isMobile ? selectedGender : 'Gender'} {isMobile && <FaCaretDown />}
          </label>
          <div className="bg-base-100 z-10 dropdown-content min-w-[12rem] p-2 shadow border rounded flex gap-2 items-center flex-wrap">
            {genders.map((gender) => (
              <label
                key={gender}
                className="flex items-center space-x-2 label cursor-pointer"
              >
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={selectedGender === gender}
                  onChange={() => handleGenderChange(gender)}
                  className="radio radio-primary"
                />
                <span className="text-sm label-text capitalize">
                  {gender === 'all' ? 'All Genders' : gender}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className={`${isMobile ? 'dropdown' : ''} mb-4 `}>
          <label
            tabIndex={0}
            className={`text-sm ${
              isMobile ? 'btn gap-2' : ''
            }  font-semibold mb-2`}
          >
            {isMobile ? selectedSize : 'Size'} {isMobile && <FaCaretDown />}
          </label>
          <div className="z-10 dropdown-content min-w-[12rem] bg-base-100 p-2 shadow border rounded flex gap-2 items-center flex-wrap">
            {sizes.map((size) => (
              <label
                key={size}
                className="flex items-center space-x-2 label cursor-pointer"
              >
                <input
                  type="radio"
                  name="size"
                  value={size}
                  checked={selectedSize === size}
                  onChange={() => handleSizeChange(size)}
                  className="radio radio-primary"
                />
                <span className="text-sm label-text capitalize">
                  {size === 'all' ? 'All Sizes' : size}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className={`${isMobile ? 'dropdown dropdown-end' : ''} mb-4 `}>
          <label
            tabIndex={0}
            className={`text-sm ${
              isMobile ? 'btn gap-2' : ''
            }  font-semibold mb-2`}
          >
            {isMobile ? selectedPrice : 'Price'} {isMobile && <FaCaretDown />}
          </label>
          <div className="z-10 dropdown-content min-w-[12rem] bg-base-100 p-2 shadow border rounded flex gap-2 items-center flex-wrap">
            {prices.map((price) => (
              <label
                key={price}
                className="flex items-center space-x-2 label cursor-pointer"
              >
                <input
                  type="radio"
                  name="price"
                  value={price}
                  checked={selectedPrice === price}
                  onChange={() => handlePriceChange(price)}
                  className="radio radio-primary"
                />
                <span className="text-sm label-text capitalize">
                  {price === 'all' ? 'All Prices' : price}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <button
        className="btn-primary btn  font-semibold py-2 px-4 rounded w-full"
        onClick={handleResetFilters}
      >
        <MdResetTv /> Reset Filters
      </button>
    </div>
  );
};

export default SideSection;
