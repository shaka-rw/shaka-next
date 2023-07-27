/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { MdArrowCircleLeft, MdArrowCircleRight } from 'react-icons/md';

const Carousel = ({ images }: { images: string[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  return (
    <div className="flex relative flex-col h-full justify-center">
      <div className="relative">
        <img
          src={images[currentImageIndex]}
          alt="Product"
          className="md:w-full md:h-96 h-64 w-full object-cover rounded-md shadow-md"
        />
        {images.length > 1 && (
          <>
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/30 text-3xl rounded-full p-1 shadow-md"
              onClick={handlePrevImage}
            >
              <MdArrowCircleLeft />
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/30 text-3xl rounded-full p-1 shadow-md"
              onClick={handleNextImage}
            >
              <MdArrowCircleRight />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex justify-center bg-black/5 absolute p-2 rounded-md bottom-1 left-[45%] -translate-y-1/2 items-center mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              className={`h-5 w-5 rounded-full mx-1 ${
                currentImageIndex === index
                  ? 'bg-primary'
                  : 'bg-secondary hover:bg-primary'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
