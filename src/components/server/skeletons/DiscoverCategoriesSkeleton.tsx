/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Simplebar from '../../client/SimpleBar';

const DiscoverCategoriesSkeleton = () => {
  // Define the number of skeleton categories you want
  const skeletonCategoryCount = 5; // Adjust this number as needed

  return (
    <>
      <div className="flex container my-4 mx-auto flex-col gap-3">
        <div className="flex items-center gap-4">
          <Simplebar className="container rounded-3xl mx-auto">
            <div className="flex container rounded-3xl flex-row flex-nowrap gap-2 items-center py-2 px-2 mx-auto">
              {Array.from({ length: skeletonCategoryCount }, (_, index) => (
                <div
                  key={index}
                  className="btn btn-sm pr-4 capitalize rounded-3xl text-sm bg-gray-300"
                  style={{ width: '150px', height: '30px' }}
                ></div>
              ))}
            </div>
          </Simplebar>
        </div>
      </div>
    </>
  );
};

export default DiscoverCategoriesSkeleton;
