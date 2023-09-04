/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import Simplebar from '../client/SimpleBar';
import { Asset, Category } from '@prisma/client';
import Image from 'next/image';

const HomeCategories = ({
  categories,
}: {
  categories: Array<Category & { image: Asset }>;
}) => {
  return (
    <>
      <div className="flex flex-col  my-8 container mx-auto px-2 md:px-0 gap-3">
        <div className="text-2xl md:text-3xl font-bold">Our Top Categories</div>
        <Simplebar className="max-w-full">
          <div className="w-full">
            <div className="flex w-full flex-col">
              <div className="flex flex-row flex-nowrap justify-start h-[200px] gap-2 items-center p-3 pr-4">
                {categories.map((cat) => (
                  <Link
                    href={`/discover?cat=${cat.id}`}
                    className={`relative group/cat overflow-hidden rounded-md flex-none h-[200px] w-[160px!important]`}
                    key={cat.id}
                  >
                    <Image
                      width={160}
                      height={200}
                      className="w-full transition-transform group-hover/cat:scale-105 h-full object-top object-cover"
                      src={cat.image.secureUrl}
                      alt={cat.name}
                    />
                    <span className=" absolute inset-0 p-3 bg-gradient-to-t from-base-content/70 to-transparent flex flex-col justify-end items-start">
                      <span className="text-lg text-base-100 font-semibold h-6 w-full flex overflow-hidden">
                        {cat.name}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Simplebar>
      </div>
    </>
  );
};
export default HomeCategories;
