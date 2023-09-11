import React from 'react';
import SimpleBar from '../../client/SimpleBar';

const HomeCategoriesSkeleton = () => {
  return (
    <div className="flex flex-col  my-8 container mx-auto px-2 md:px-0 gap-3">
      <div className="text-2xl font-bold">Our Top Categories</div>
      <SimpleBar className="max-w-full">
        <div className="w-full">
          <div className="flex w-full flex-col">
            <div className="flex flex-row flex-nowrap justify-start h-[200px] gap-2 items-center p-3 pr-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  className={`relative group/cat overflow-hidden rounded-md flex-none h-[200px!important] w-[160px!important]`}
                  key={i}
                >
                  <span className="animate-pulse bg-base-200 h-full w-full" />
                  <span className=" absolute inset-0 p-3 bg-gradient-to-t from-base-content/70 to-transparent flex flex-col justify-end items-start"></span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </SimpleBar>
    </div>
  );
};

export default HomeCategoriesSkeleton;
