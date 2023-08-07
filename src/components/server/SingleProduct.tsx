/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Slider from 'react-slick';
import { Asset, Product as SingleProduct, ProductColor } from '@prisma/client';

const SingleProduct = ({ product }: { product: SingleProduct }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="product">
      <h2>{product.name}</h2>
      <div className="product-colors">
        {((product as any).colors as ProductColor[]).map((color) => (
          <div key={color.id} className="product-color">
            <img
              src={(color as any).mainImage.secureUrl}
              alt={color.name ?? ''}
            />
          </div>
        ))}
      </div>
      <div className="product-images">
        {((product as any).colors as ProductColor[]).map((color) => (
          <div key={color.id}>
            <h3>{color.name}</h3>
            <Slider {...settings}>
              {((color as any).images as Asset[]).map((image) => (
                <div key={image.id}>
                  <img src={image.secureUrl} alt={color.name ?? ''} />
                </div>
              ))}
            </Slider>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleProduct;
