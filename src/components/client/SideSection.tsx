'use client';

import useMobile from '@/hooks/useMobile';
import React, { FormEventHandler, useState } from 'react';
import { FaCaretDown, FaCheckDouble } from 'react-icons/fa';
import { MdResetTv, MdSearch } from 'react-icons/md';
import numeral from 'numeral';
import { useRouter, usePathname } from 'next/navigation';
import { ProductGender } from '@prisma/client';

export type PriceRange = { start: number | ''; end: number | '' };
export type Size = '' | 'small' | 'medium' | 'large';

const SideSection = ({ catId }: { catId?: string }) => {
  const [selectedGender, setSelectedGender] = useState(ProductGender.UNISEX);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedSearchType, setSelectedSearchType] = useState('products');
  const [selectedPrice, setSelectedPrice] = useState('');
  const isMobile = useMobile();
  const router = useRouter();
  const pathname = usePathname();

  const genders: ProductGender[] = [
    ProductGender.FEMALE,
    ProductGender.MALE,
    ProductGender.UNISEX,
  ];
  const searchTypes: ('products' | 'shops')[] = ['products', 'shops'];
  const sizes: Size[] = ['', 'small', 'medium', 'large'];
  const prices: PriceRange[] = [
    { start: '', end: '' },
    { start: 1, end: 1000 },
    { start: 1001, end: 10000 },
    { start: 10001, end: 50000 },
    { start: 50001, end: 100000 },
    { start: 100001, end: 200000 },
    { start: 200001, end: 500000 },
    { start: 500001, end: 1000000 },
    { start: 1000001, end: Infinity },
  ];

  const handleGenderChange = (value: any) => setSelectedGender(value);
  const handleSizeChange = (value: any) => setSelectedSize(value);
  const handlePriceChange = (value: any) => setSelectedPrice(value);
  const handleSearchTypeChange = (value: any) => setSelectedSearchType(value);

  const handleResetFilters = () => {
    setSelectedGender(ProductGender.UNISEX);
    setSelectedSize('');
    setSelectedPrice('');
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget as any));
    const params = new URLSearchParams();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        params.append(key, data[key] as string);
      }
    }
    const query = params.toString();
    router.replace(`${pathname}?${query}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      method="GET"
      className="w-full flex flex-col gap-2 p-2 md:w-60 xl:w-72 border-r-0 md:border-r md:bg-base-200 h-full"
    >
      {catId && <input type="hidden" name="cat" value={catId} />}
      <div className="flex items-center justify-between gap-2"></div>
      <div className="form-control relative w-full max-w-xs">
        <MdSearch className="text-xl absolute top-1/2 left-2 -translate-y-1/2" />
        <input
          type="text"
          name="q"
          placeholder="Search.."
          className="input input-bordered w-full max-w-xs pl-8"
        />
      </div>
      <div className={` ${isMobile ? 'flex gap-2 items-center ' : ''} `}>
        <div className={`${isMobile ? 'dropdown' : ''} md:mb-4 `}>
          <label
            tabIndex={0}
            className={`flex-nowrap text-xs md:text-sm ${
              isMobile ? 'btn gap-2' : ''
            }  font-semibold mb-2`}
          >
            {isMobile ? selectedSearchType : 'Search For'}{' '}
            {isMobile && <FaCaretDown />}
          </label>
          <div className="bg-base-100 z-10 dropdown-content min-w-[12rem] p-2 shadow border rounded-lg flex gap-2 items-center flex-wrap">
            {searchTypes.map((st) => (
              <label
                key={st}
                className="flex items-center space-x-2 label cursor-pointer"
              >
                <input
                  type="radio"
                  name="st"
                  value={st}
                  checked={selectedSearchType === st}
                  onChange={() => handleSearchTypeChange(st)}
                  className="radio radio-primary"
                />
                <span className="text-sm label-text capitalize">{st}</span>
              </label>
            ))}
          </div>
        </div>
        <div
          className={`${selectedSearchType !== 'products' ? 'hidden' : ''} ${
            isMobile ? 'dropdown' : ''
          } md:mb-4 `}
        >
          <label
            tabIndex={0}
            className={`flex-nowrap text-xs md:text-sm ${
              isMobile ? 'btn gap-2' : ''
            }  font-semibold mb-2`}
          >
            {isMobile ? selectedGender : 'Gender'} {isMobile && <FaCaretDown />}
          </label>
          <div className="bg-base-100 z-10 dropdown-content min-w-[12rem] p-2 shadow border rounded-lg flex gap-2 items-center flex-wrap">
            {genders.map((gender) => (
              <label
                key={gender}
                className="flex items-center space-x-2 label cursor-pointer"
              >
                <input
                  type="radio"
                  name="g"
                  value={gender}
                  checked={selectedGender === gender}
                  onChange={() => handleGenderChange(gender)}
                  className="radio radio-primary"
                />
                <span className="text-sm label-text capitalize">
                  {gender === ProductGender.UNISEX ? 'All Genders' : gender}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div
          className={`${selectedSearchType !== 'products' ? 'hidden' : ''} ${
            isMobile ? 'dropdown' : ''
          } md:mb-4 `}
        >
          <label
            tabIndex={0}
            className={`flex-nowrap text-xs md:text-sm ${
              isMobile ? 'btn gap-2' : ''
            }  font-semibold mb-2`}
          >
            {isMobile ? selectedSize : 'Size'} {isMobile && <FaCaretDown />}
          </label>
          <div className="z-10 dropdown-content min-w-[12rem] bg-base-100 p-2 shadow border rounded-lg flex gap-2 items-center flex-wrap">
            {sizes.map((size) => (
              <label
                key={size}
                className="flex items-center space-x-2 label cursor-pointer"
              >
                <input
                  type="radio"
                  name="sz"
                  value={size}
                  checked={selectedSize === size}
                  onChange={() => handleSizeChange(size)}
                  className="radio radio-primary"
                />
                <span className="text-sm label-text capitalize">
                  {size === '' ? 'All Sizes' : size}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div
          className={`${selectedSearchType !== 'products' ? 'hidden' : ''} ${
            isMobile ? 'dropdown dropdown-end' : ''
          } md:mb-4 `}
        >
          <label
            tabIndex={0}
            className={`flex-nowrap text-xs md:text-sm ${
              isMobile ? 'btn gap-2' : ''
            }  font-semibold mb-2`}
          >
            {isMobile ? selectedPrice : 'Price'} {isMobile && <FaCaretDown />}
          </label>
          <div className="z-10  dropdown-content min-w-[12rem] bg-base-100 p-2 shadow border rounded-lg flex gap-2 items-center flex-wrap">
            {prices.map((price) => (
              <label
                key={`${price.start}${price.end}`}
                className="flex items-center space-x-2 label cursor-pointer"
              >
                <input
                  type="radio"
                  name="p"
                  value={
                    price.start === '' ? '' : `${price.start}-${price.end}`
                  }
                  checked={
                    selectedPrice ===
                    (price.start === '' ? '' : `${price.start}-${price.end}`)
                  }
                  onChange={(e) => handlePriceChange(e.currentTarget.value)}
                  className="radio radio-primary"
                />
                <span className="text-sm label-text capitalize">
                  {price.start === ''
                    ? 'All Prices'
                    : price.end === Infinity
                    ? `Over ${numeral(price.start).format('0a')}`
                    : `${numeral(price.start).format('0a')} - ${numeral(
                        price.end
                      ).format('0a')}`}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-full -order-1 items-center gap-2">
        <button
          type="submit"
          className="btn-primary btn btn-sm md:btn-md  font-semibold"
        >
          <FaCheckDouble /> Apply
        </button>
        <button
          type="button"
          className="btn-secondary btn btn-sm md:btn-md btn-outline  font-semibold"
          onClick={handleResetFilters}
        >
          <MdResetTv /> Reset Filters
        </button>
      </div>
    </form>
  );
};

export default SideSection;
