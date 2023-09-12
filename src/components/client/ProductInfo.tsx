/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { MdFavorite } from 'react-icons/md';
import { VariationProduct } from '../forms/AddVariationsForm';
import { Asset, Category, ProductColor, Shop } from '@prisma/client';
import Image from 'next/image';
import Link from '@/components/server/Link';
import AddToCartForm from '../forms/AddToCartForm';

const ProductInfo = ({
  product,
}: {
  product: VariationProduct & {
    categories: (Category & { image: Asset })[];
    shop: Shop & { image: Asset };
    colors: (ProductColor & { mainImage: Asset; images: Asset[] })[];
  };
}) => {
  const [activeColorIndex, setActiveColorIndex] = useState(0);

  const color = product.colors[activeColorIndex];
  const colorOptions: ColorOptions[] = [
    ...(activeColorIndex === 0
      ? [
          {
            id: product.assetId,
            image: product.mainImage.secureUrl,
            label: 'Color 1',
          },
        ]
      : []),
    {
      id: color.mainImage.id,
      label: `Color ${activeColorIndex === 0 ? 2 : 1}`,
      image: color.mainImage.secureUrl,
    },
    ...color.images.map((image, i) => ({
      id: image.id,
      label: `Color ${activeColorIndex === 0 ? i + 2 : i + 3}`,
      image: image.secureUrl,
    })),
  ];

  const minPrice = Math.min(...product.quantities.map((q) => q.price));
  const maxPrice = Math.max(...product.quantities.map((q) => q.price));

  return (
    <main>
      <div className="w-full mx-auto container p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <ProductImageSlider colorOptions={colorOptions} />
          </div>
          <div className="col-span-1">
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="text-sm text-gray-500">
              {product.categories
                .slice(0, 4)
                .map(({ name }) => name)
                .join(', ')}
            </p>
            <div className="mt-4">
              <p className="text-gray-600">Available Colors:</p>
              {/* List of color options, make them clickable */}
              <div className="flex space-x-2 mt-2">
                {product.colors.map((color, i) => (
                  <Image
                    alt="Color"
                    onClick={() => setActiveColorIndex(i)}
                    height={40}
                    width={40}
                    key={color.id}
                    className={`w-10 duration-300 transition-colors border border-transparent hover:border-primary h-10 rounded-3xl cursor-pointer object-cover ${
                      activeColorIndex === i
                        ? 'bg-primary p-1 border-primary '
                        : ''
                    }  `}
                    src={color.mainImage.secureUrl}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-600">Available Sizes:</p>
              {/* List of color options, make them clickable */}
              <div className="flex space-x-2 mt-2">
                {product.sizes.map((size) => (
                  <span
                    key={size.id}
                    className="w-10 h-10 rounded-3xl bg-base-200 inline-flex justify-center items-center cursor-pointer object-cover  "
                  >
                    {size.size.slice(0, 2).toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-600">Price Range:</p>
              <p className="text-lg font-semibold">
                {minPrice}RWF - {maxPrice}RWF
              </p>
              {product.prevPrice && (
                <p className="text-gray-400 line-through">
                  {product.prevPrice}RWF
                </p>
              )}
            </div>
            <div className="mt-4 flex items-center gap-2">
              {/* Add to favorites and add to cart buttons */}
              <button className="btn btn-sm btn-secondary btn-outline rounded-3xl">
                <MdFavorite /> Add to Favorites
              </button>
              <AddToCartForm
                product={product}
                btnText="Add to cart"
                className="btn-sm"
              />
            </div>
            <div className="mt-4">
              <p className="text-gray-600 mb-2 ">Shop:</p>
              <div className="btn py-2 flex items-center space-x-2 w-fit">
                <Image
                  src={product.shop.image.secureUrl}
                  alt={product.shop.name}
                  height={32}
                  width={32}
                  className="w-8 h-8 rounded-full"
                />
                <Link
                  href={`/shops/${product.shop.id}`}
                  className="hover:underline"
                >
                  {product.shop.name}
                </Link>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-600 font-semibold mb-1">Description:</p>
              <p className="text-gray-700">{product.description}</p>
            </div>
          </div>
        </div>
        <ProductTabs />
      </div>
    </main>
  );
};

export default ProductInfo;

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState('delivery');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full p-4 mt-8 border-t border-gray-300">
      <div className="tabs tabs-boxed">
        <button
          className={`tab ${
            activeTab === 'delivery' ? 'tab-active' : ''
          } transition-colors rounded-[1.5rem!important]`}
          onClick={() => handleTabChange('delivery')}
        >
          Delivery
        </button>
        <button
          className={`tab ${
            activeTab === 'reviews' ? 'tab-active' : ''
          } transition-colors rounded-[1.5rem!important]`}
          onClick={() => handleTabChange('reviews')}
        >
          Reviews
        </button>
        <button
          className={`tab ${
            activeTab === 'sizesGuide' ? 'tab-active' : ''
          } transition-colors rounded-[1.5rem!important] duration-300`}
          onClick={() => handleTabChange('sizesGuide')}
        >
          Sizes Guide
        </button>
      </div>
      <div className="mt-4">
        {activeTab === 'delivery' && (
          <div>
            <p className="text-gray-600">Delivery Information:</p>
            <p className="text-gray-700">Placeholder for delivery details.</p>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div>
            <p className="text-gray-600">Reviews:</p>
          </div>
        )}
        {activeTab === 'sizesGuide' && (
          <div>
            <p className="text-gray-600">Sizes Guide:</p>
            <p className="text-gray-700">
              Placeholder for sizes guide information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export type ColorOptions = {
  id: string;
  label: string;
  image: string;
};

const ProductImageSlider = ({
  colorOptions = [],
}: {
  colorOptions: ColorOptions[];
}) => {
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]?.id ?? '');

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div className="w-full rounded-lg bg-base-200 p-2">
      <Carousel
        showThumbs={false}
        selectedItem={colorOptions.findIndex(
          (color) => color.id === selectedColor
        )}
        onChange={(index) => handleColorChange(colorOptions[index].id)}
      >
        {colorOptions.map((color) => (
          <div className="h-[500px] rounded-md overflow-hidden" key={color.id}>
            <img
              src={color.image}
              alt={color.label}
              className="h-full rounded-lg w-full object-contain"
            />
          </div>
        ))}
      </Carousel>
      <div className="flex justify-center mt-4 space-x-2">
        {colorOptions.map((color) => (
          <Image
            key={color.id}
            src={color.image}
            alt={color.label}
            height={32}
            width={32}
            className={`w-8 h-8 border ${
              selectedColor === color.id ? 'border-blue-500' : 'border-gray-300'
            } rounded-full cursor-pointer`}
            onClick={() => handleColorChange(color.id)}
          />
        ))}
      </div>
    </div>
  );
};
