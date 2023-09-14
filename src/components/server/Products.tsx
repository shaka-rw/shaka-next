/* eslint-disable @next/next/no-img-element */
import { MdFavoriteBorder, MdFavorite, MdEmojiObjects } from 'react-icons/md';
import { VariationProduct } from '../forms/AddVariationsForm';
import { Category, Shop } from '@prisma/client';
import AddToCartForm from '../forms/AddToCartForm';
import Link from '@/components/server/Link';
import Image from 'next/image';

const Products = ({
  products,
  isSeller = false,
}: {
  products: Array<
    VariationProduct & {
      shop: Shop & { category: Category };
      categories: Category[];
    }
  >;
  isSeller?: boolean;
}) => {
  return (
    <>
      {products.length === 0 && (
        <div className="flex justify-center items-center min-h-max w-full p-4">
          <div className="alert alert-info flex gap-2">
            <MdEmojiObjects /> No products found.
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 p-2 md:p-0 md:gap-y-10 gap-2 md:gap-x-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center">
        {products.map((product) => {
          const minPrice = Math.min(...product.quantities.map((q) => q.price));
          const maxPrice = Math.max(...product.quantities.map((q) => q.price));

          return (
            <div
              key={product.id}
              className="flex md:h-[444px] md:hover:scale-105 border border-primary/30 hover:border-secondary hover:z-[1] bg-base-100 transition-all duration-300 group/product border-b shadow-sm overflow-hidden w-full md:w-[250px] flex-col rounded-lg"
            >
              <Link
                href={`/products/${product.id}`}
                className="h-[200px] md:h-[250px] p-2 border-b border-base-200 flex items-center justify-center relative w-full"
              >
                <Image
                  width={250}
                  height={250}
                  src={product.mainImage.secureUrl}
                  alt={product.name}
                  className="w-full min-w-full h-full object-center rounded appearance-none object-contain"
                />
                <span className="absolute text-base-100 transition-opacity duration-300 opacity-0 group-hover/product:opacity-100 flex justify-end  w-full inset-0 bottom-auto h-[50px] bg-gradient-to-b from-base-content/50 to-transparent">
                  <a className="group/a cursor-pointer btn-square justify-center items-center inline-flex font-extrabold text-xl">
                    <MdFavoriteBorder className="group-hover/a:hidden" />
                    <MdFavorite className="hidden group-hover/a:inline" />
                  </a>
                </span>
              </Link>
              <div className="flex flex-col flex-1 bg-gradient-to-t from-base-200 to-transparent justify-between gap-2 p-2">
                <span className="text-secondary text-sm uppercase">
                  {product.categories?.[0]?.name ?? product.shop.category.name}
                </span>
                <Link href={`/products/${product.id}`} className=" font-bold">
                  {product.name}
                </Link>
                <div className="text-xs md:text-sm font-semibold">
                  {minPrice !== maxPrice
                    ? `${minPrice}RWF - ${maxPrice}RWF`
                    : `${minPrice}RWF`}
                </div>
                {
                  <div
                    className={`text-xs line-through md:text-sm font-light ${
                      product.prevPrice ? '' : ' hidden '
                    }`}
                  >
                    {product.prevPrice ?? 0}RWF
                  </div>
                }
                <div className="text-xs h-4 w-full flex overflow-hidden">
                  {product.description}...
                </div>
                <div className="flex items-center">
                  <AddToCartForm
                    className="btn rounded-3xl mt-1 btn-secondary btn-sm"
                    btnText="Add to cart"
                    product={product}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Products;
