import React from 'react';
import { MdFavoriteBorder, MdFavorite, MdEmojiObjects } from 'react-icons/md';

const ProductsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 p-2 md:p-0 md:gap-y-10 gap-2 md:gap-x-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center">
      {Array.from({ length: 10 }, (_, index) => (
        <div
          key={index}
          className="flex md:h-[444px] border border-primary/30 bg-base-100 transition-all duration-300 group/product border-b shadow-sm overflow-hidden w-full md:w-[250px] flex-col rounded-lg"
        >
          <div className="h-[250px] p-2 border-b border-base-200 flex items-center justify-center w-full relative">
            <div className="w-full min-w-full h-full object-center rounded appearance-none bg-gray-200"></div>
            <span className="absolute text-base-100 transition-opacity duration-300 opacity-0 group-hover/product:opacity-100 flex justify-end w-full inset-0 bottom-auto h-[50px] bg-gradient-to-b from-base-content/50 to-transparent">
              <a className="group/a cursor-pointer btn-square justify-center items-center inline-flex font-extrabold text-xl">
                <MdFavoriteBorder className="group-hover/a:hidden" />
                <MdFavorite className="hidden group-hover/a:inline" />
              </a>
            </span>
          </div>
          <div className="flex flex-col flex-1 bg-gradient-to-t from-base-200 to-transparent justify-between gap-2 p-2">
            <span className="text-secondary text-sm uppercase bg-gray-200 w-1/2 h-4"></span>
            <div className="font-bold bg-gray-200 w-3/4 h-5"></div>
            <div className="text-xs md:text-sm font-semibold bg-gray-200 w-1/2 h-4"></div>
            <div className="text-xs line-through md:text-sm font-light bg-gray-200 w-1/2 h-4"></div>
            <div className="text-xs h-4 w-full flex overflow-hidden bg-gray-200"></div>
            <div className="flex items-center bg-gray-200 w-3/4 h-8"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsSkeleton;
