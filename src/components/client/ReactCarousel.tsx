'use client';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';

export const ReactCarousel = ({ imageUrls }: { imageUrls: string[] }) => {
  return (
    <Carousel
      showArrows={true}
      showThumbs={true}
      //   showStatus={false}
      infiniteLoop={true}
      //   autoPlay={true}
      interval={3000} // Change this value to set the interval between slides in milliseconds
    >
      {imageUrls.map((imageUrl, index) => (
        <div key={index}>
          <img src={imageUrl} alt={`Slide ${index}`} />
        </div>
      ))}
    </Carousel>
  );
};

export default ReactCarousel;
