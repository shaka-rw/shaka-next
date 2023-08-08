'use client';
import React, { PropsWithChildren, useRef } from 'react';
import { MdArrowCircleLeft, MdArrowCircleRight } from 'react-icons/md';

const HorizontalScrollButtons = ({
  speed = 200,
  children,
}: PropsWithChildren<{ speed?: number }>) => {
  const scrollRef = useRef<HTMLElement>(null);

  const handleScrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollLeft -= speed;
  };

  const handleScrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollLeft += speed;
  };
  return (
    <>
      <button
        className="btn btn-sm  btn-circle text-xl"
        onClick={handleScrollLeft}
      >
        <MdArrowCircleLeft />
      </button>
      <div
        className="flex flex-1 w-full p-1 scroll-smooth rounded-md  gap-2 overflow-x-auto"
        ref={scrollRef as any}
      >
        {children}
      </div>
      <button
        className="btn btn-sm btn-circle text-xl"
        onClick={handleScrollRight}
      >
        <MdArrowCircleRight />
      </button>
    </>
  );
};

export default HorizontalScrollButtons;
