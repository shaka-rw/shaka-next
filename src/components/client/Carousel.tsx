/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { MdArrowCircleLeft, MdArrowCircleRight } from 'react-icons/md';
import { color, motion } from 'framer-motion';
import { Asset, ProductColor } from '@prisma/client';

const Carousel = ({
  images: plainImages,
  autoPlay = false,
  duration = 4000,
  colors,
}: {
  images: string[];
  autoPlay?: boolean;
  duration?: number;
  colors?: ProductColor[];
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [activeIndex, setAtiveIndex] = useState(0);

  // const [duration, setDuration] = useState(0);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      handleNextImage();
      // setDuration((seconds) => seconds + 1);
    }, duration) as any;
    return () => clearInterval(interval);
  }, [autoPlay, duration, handleNextImage]);

  useEffect(() => {
    if (plainImages.length && !colors) {
      setImages(plainImages);
    }
  }, [plainImages, colors]);

  useEffect(() => {
    if (colors) {
      setImages(
        ((colors as any[])[activeIndex].images as Asset[]).map(
          (img) => img.secureUrl
        )
      );
    }
  }, [colors, activeIndex]);

  useEffect(() => {
    console.log({ images });
  }, [images]);

  return (
    <div className="flex relative flex-col h-full">
      <div className="flex relative flex-col h-full">
        <div className="flex items-center gap-[.12rem] h-full">
          {images.length > 1 && (
            <button
              className="transform bg-white/30 text-xl h-fit btn-outline border-r rounded-full p-1 shadow-md"
              onClick={handlePrevImage}
            >
              <MdArrowCircleLeft />
            </button>
          )}
          <div className="flex-1 flex justify-center items-center  md:h-96 h-64 w-full">
            <motion.img
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={images[currentImageIndex]}
              alt="Product"
              className="max-w-full w-auto h-auto max-h-full animate-fade transition-opacity duration-200 object-contain rounded-md "
            />
          </div>

          {images.length > 1 && (
            <button
              className=" transform bg-white/30 text-xl h-fit btn-outline border-l bg-base-300 rounded-full p-1 shadow-md"
              onClick={handleNextImage}
            >
              <MdArrowCircleRight />
            </button>
          )}
        </div>

        {!autoPlay && images.length > 1 ? (
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
        ) : (
          <></>
        )}
      </div>
      {colors && (
        <div className="flex overflow-x-auto w-full justify-center items-center bg-base-300 gap-1 my-1 p-2 join-horizontal join">
          {colors.map((color, i) => (
            <div
              key={color.id}
              tabIndex={0}
              onClick={() => setAtiveIndex(i)}
              className={`avatar w-12 h-12  transition-all join-item overflow-hidden rounded ${
                activeIndex === i
                  ? ' border p-1 border-primary bg-secondary '
                  : ''
              } `}
            >
              <img
                src={((color as any).mainImage as Asset).secureUrl}
                alt="Color"
                className="object-contain h-full w-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
