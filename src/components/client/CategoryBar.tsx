/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useRef } from 'react';
import { MdArrowCircleLeft, MdArrowCircleRight } from 'react-icons/md';
import { CategoryWithSubs } from '../CategoryList';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const CategoryBar = ({
  categories,
  catId,
}: {
  categories: CategoryWithSubs[];
  catId?: string;
}) => {
  const scrollRef = useRef<HTMLElement>(null);
  const params = useSearchParams();

  const handleScrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollLeft -= 200; // Adjust the scrolling speed as needed
  };

  const handleScrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollLeft += 200; // Adjust the scrolling speed as needed
  };

  function removeQueryParam(url: string, paramKey: string) {
    const regex = new RegExp(`([?&])${paramKey}=.*?(&|$)`, 'i');
    return url.replace(regex, '$1').replace(/(&|\?)$/, '');
  }

  useEffect(() => {
    console.log({
      noCat: `?${removeQueryParam(params.toString() || 'n=1', 'cat')}`,
    });
  }, [params]);

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
        {categories.map((cat) => (
          <div key={cat.id} className="">
            <label tabIndex={0}>
              <Link
                href={`/discover${
                  removeQueryParam('?' + params.toString() || 'n=1', 'cat') ||
                  cat.id !== catId
                    ? '?'
                    : ''
                }${cat.id === catId ? '' : `cat=${cat.id}`}`}
                className={`btn border-0 gap-2 items-center flex-nowrap w-fit py-2  ${
                  cat.id === catId ? ' btn-secondary border ' : 'bg-base-100'
                }`}
              >
                <div className="avatar overflow-hidden rounded-full h-7 w-7 min-h-[1.75rem] min-w-[1.75rem] border">
                  <img
                    src={cat.image.secureUrl}
                    alt={cat.name}
                    className="w-full object-contain h-full"
                  />
                </div>
                <span className="font-semibold break-keep text-sm md:text-base">
                  {cat.name}
                </span>
              </Link>
            </label>
            {/* <ul
              tabIndex={0}
              className="hidden z-[1] flex-col p-2 shadow bg-base-100 border rounded-box min-w-[13rem]"
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
            </ul> */}
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
