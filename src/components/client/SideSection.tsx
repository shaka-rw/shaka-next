'use client';

import React, { useEffect, useState } from 'react';
import { MdClose, MdMenu } from 'react-icons/md';

const SideSection = () => {
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [open, setOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

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
    <div
      className={`p-4 bg-base-200 max-w-full ${
        isMobile ? 'z-10' : 'w-60 h-full'
      }

      ${isMobile && open ? 'fixed w-full h-full inset-0' : ''}
      ${
        isMobile && !open
          ? 'w-fit p-1 fixed flex justify-center items-center bottom-4 left-4 h-12 rounded '
          : ''
      }
      
     flex-1 `}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold md:mb-4">
          {!isMobile ? 'Discover' : ''}
        </h2>
        {isMobile && (
          <button
            onClick={() => setOpen((p) => !p)}
            className="btn btn-sm btn-outline text-xl btn-cicle"
          >
            {open ? <MdClose /> : <MdMenu />}
          </button>
        )}
      </div>
      <div className={`${isMobile && !open ? 'hidden' : ''}`}>
        <div className={`mb-4 `}>
          <h3 className="text-sm font-semibold mb-2">Gender</h3>
          <div className="bg-base-100 p-2 shadow border rounded flex gap-2 items-center flex-wrap">
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

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Size</h3>
          <div className="bg-base-100 p-2 shadow border rounded flex gap-2 items-center flex-wrap">
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

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Price</h3>
          <div className="bg-base-100 p-2 shadow border rounded flex gap-2 items-center flex-wrap">
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

        <button
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded w-full"
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default SideSection;
