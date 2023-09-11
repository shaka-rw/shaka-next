/* eslint-disable @next/next/no-img-element */
import Simplebar from '../../client/SimpleBar';

const HomeShopsSkeleton = async () => {
  return (
    <div className="container my-10 p-2 mx-auto ">
      <h3 className="text-2xl mb-5 font-bold">Top Stores</h3>
      <Simplebar>
        <div className="grid max-w-full rounded-sm p-1 grid-rows-2 grid-flow-col gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="grid w-[300px] border border-transparent hover:border-primary cursor-pointer p-3 rounded-lg bg-base-200/50 items-center  gap-2 grid-cols-[auto,1fr]"
            >
              <span className="w-10 h-10 object-cover bg-base-300 rounded-full" />
              <span className="flex gap-1 flex-col">
                <span className="h-5 rounded-xl w-[100px] bg-base-300" />
                <span className="rounded-xl w-[200px] bg-base-300 h-4" />
              </span>
            </span>
          ))}
        </div>
      </Simplebar>
    </div>
  );
};

export default HomeShopsSkeleton;
