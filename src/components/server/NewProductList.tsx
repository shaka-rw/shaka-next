/* eslint-disable @next/next/no-img-element */
import React from 'react';

const NewProductList = ({ isDiscover = false }: { isDiscover?: boolean }) => {
  return (
    <section className={`${isDiscover ? 'my-4' : 'my-8'}`}>
      <div className="container flex-col flex gap-3 mx-auto px-3">
        <div className="flex gap-2 justify-between">
          <h2 className="text-lg font-semibold">
            {!isDiscover ? (
              'Top products'
            ) : (
              <div className="form-control w-full max-w-2xl">
                {/* <label className="label">
                  <span className="label-text">What is your name?</span>
                </label> */}
                <input
                  type="search"
                  placeholder="Search here..."
                  className="input input-bordered w-full max-w-2xl"
                />
              </div>
            )}
          </h2>
          {!isDiscover && (
            <span className="link">Discover products &rarr;</span>
          )}
        </div>
        <div
          className={`grid  md:grid-cols-3 ${
            isDiscover ? 'lg:grid-cols-4' : ' lg:grid-cols-5'
          } gap-2 py-4`}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col bg-base-200 rounded-md p-3 gap-3"
            >
              <div className="avatar rounded justify-self-end self-end overflow-hidden h-52 w-full">
                <img
                  src={`/assets/imgs/products/product-${i + 1}-1.jpg`}
                  alt="Product"
                  className="object-cover object-center"
                />
              </div>
              <div className="flex flex-col mt-2 gap-2">
                <span className="text-sm text-gray-500">Ships to Kigali</span>
                <h3 className="text-lg font-semibold">Men stripped T-Shirt</h3>
                <div className="flex gap-3">
                  <div className="rating rating-sm">
                    <input
                      type="radio"
                      name="rating-2"
                      className="mask mask-star-2 bg-secondary"
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      className="mask mask-star-2 bg-secondary"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      className="mask mask-star-2 bg-secondary"
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      className="mask mask-star-2 bg-secondary"
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      className="mask mask-star-2 bg-secondary"
                    />
                  </div>
                  <span className="text-sm text-gray-500">121 Reviews</span>
                </div>
                <div className="p-3 font-bold text-2xl">347.99 RWF</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewProductList;
