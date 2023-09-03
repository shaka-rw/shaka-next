import Image from 'next/image';

/* eslint-disable @next/next/no-img-element */
const Banner = ({
  title,
  desc,
  img,
}: {
  title: string;
  desc: string;
  img: string;
}) => {
  return (
    <div className="container group/banner mx-auto p-2 md:p-0 ">
      <div className="grid border border-transparent hover:border-base-content mt-5 md:my-10 overflow-hidden rounded-xl bg-base-200 items-center md:grid-cols-2">
        <div className="flex flex-col p-6 justify-self-center justify-center gap-3">
          <h3 className="text-4xl md:text-5xl max-w-xs mb-5 font-bold">
            {title}
          </h3>
          <p className="text-base-content max-w-xs">{desc}</p>
          <button className="btn btn-outline mt-5 rounded-full flex-nowrap w-fit group  ">
            Learn more{' '}
            <span className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </button>
        </div>
        <div className=" self-end w-ful flex justify-center w-full h-full p-4 items-center justify-self-center ">
          <Image
            className="h-[230px] md:hover:scale-105 md:group-hover/banner:scale-105 group-hover/banner:z-[1] transition-transform duration-500 shadow-2xl w-full md:w-[300px] min-w-full md:min-w-[300px] object-cover rounded-xl"
            src={img}
            height={230}
            width={300}
            alt={title}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
