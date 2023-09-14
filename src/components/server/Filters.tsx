'use client';
import { usePathname, useRouter } from 'next/navigation';
import {
  MdFilterList,
  MdArrowCircleRight,
  MdOutlineSort,
  MdSearch,
  MdRecycling,
} from 'react-icons/md';
import DualRangeSlider from './DualRange';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';

const filtersSchema = z.object({
  category: z.string(),
  search: z.string(),
  gender: z.enum(['MALE', 'FEMAL', 'UNISEX']),
  size: z.string(),
  startPrice: z.number().min(100).or(z.literal('')),
  endPrice: z.number().min(100).max(1000000).or(z.literal('')),
  searchType: z.enum(['products', 'shops']),
});

const Filters = ({ catId = '' }: { catId?: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const {
    handleSubmit,
    setValue,
    register,
    reset,
    formState: { errors, touchedFields },
  } = useForm<z.infer<typeof filtersSchema>>({
    defaultValues: {
      category: catId,
      endPrice: '',
      startPrice: '',
      searchType: 'products',
      gender: 'UNISEX',
      size: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof filtersSchema>> = (data) => {
    const params = new URLSearchParams();

    if (catId) params.append('cat', catId);
    if (data.searchType) params.append('st', data.searchType);
    if (data.search) params.append('q', data.search);
    if (data.size) params.append('sz', data.size);
    if (data.startPrice && data.endPrice)
      params.append('p', `${data.startPrice}-${data.endPrice}`);

    const query = params.toString();
    router.replace(`${pathname}?${query}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register('category', { value: catId })} />
      <div className="container p-2 border-b mb-2 mx-auto">
        <div className="flex items-center flex-wrap gap-2 justify-between">
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="text-xl" />
              </span>
              <input
                placeholder="Search"
                type="text"
                onKeyUp={(e) => {
                  if (e.key === 'Enter' && e.currentTarget?.value?.trim()) {
                    handleSubmit(onSubmit)();
                  }
                }}
                className="pl-10 input input-sm input-bordered focus:ring-0 hover:ring-0 hover:outline-none outline-none rounded-3xl "
                {...register('search')}
              />
            </div>
          </div>
          <div className="flex items-center p-1 rounded-3xl px-2 border gap-3">
            {/* <button className="btn btn-sm text-xs capitalize btn-outline border-0 rounded-3xl">
              <MdOutlineSort className="text-xl" /> Sort
            </button> */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-sm btn-outline border-0 rounded-3xl"
              >
                <MdFilterList className="text-xl" /> Filter
              </label>
              <div className="dropdown-content p-2 rounded-xl shadow-lg border min-w-[200px] bg-base-200 z-10">
                <div className="w-full">
                  <span className="label-text font-semibold">*Search For</span>
                  <div className="form-control items-start">
                    <label tabIndex={0} className="label cursor-pointer">
                      <input
                        type="radio"
                        value={'products'}
                        className="radio checked:font-semibold mr-2"
                        defaultChecked
                        {...register('searchType')}
                      />
                      <span className="label-text">Products</span>
                    </label>
                    <label tabIndex={0} className="label cursor-pointer">
                      <input
                        type="radio"
                        value={'shops'}
                        className="radio checked:font-semibold mr-2"
                        {...register('searchType')}
                      />
                      <span className="label-text">Shops</span>
                    </label>
                  </div>
                </div>

                <div className="">
                  <label
                    tabIndex={0}
                    className="cursor-pointer w-full items-start gap-2 flex flex-col label"
                  >
                    <span className="label-text font-bold">Price Range</span>
                    <DualRangeSlider
                      min={100}
                      max={1000000}
                      step={5000}
                      onChange={([start, end]) => {
                        setValue('startPrice', start);
                        setValue('endPrice', end);
                      }}
                    />
                  </label>
                </div>

                <div>
                  <div className="form-control gap-2 py-1 items-start">
                    <label tabIndex={0} className="label-text font-bold">
                      Gender
                    </label>
                    <select
                      defaultValue={'UNISEX'}
                      className="select select-bordered select-sm w-full max-w-xs"
                      {...register('gender')}
                    >
                      <option value={'MALE'}>Male</option>
                      <option value={'FEMALE'}>Female</option>
                      <option value={'UNISEX'} defaultChecked>
                        Unisex
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <div className="form-control gap-2 items-start">
                    <label tabIndex={0} className="label-text font-bold">
                      Size
                    </label>
                    <select
                      className="select select-bordered select-sm w-full max-w-xs"
                      {...register('size')}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="xlarge">X-Large</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-stretch px-1 gap-1">
                  <button
                    type="button"
                    className="bnt-sm btn mt-2 btn-secondary btn-outline rounded-3xl"
                    onClick={() => reset()}
                  >
                    <MdRecycling /> Reset
                  </button>
                  <button
                    type="submit"
                    className="btn rounded-3xl ml-3 ring-3 btn-secondary btn-sm"
                  >
                    APPLY <MdArrowCircleRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Filters;
