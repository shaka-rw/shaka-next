'use client';
import Link from 'next/link';
import React from 'react';
import { AiOutlineWarning } from 'react-icons/ai';
import { MdHome } from 'react-icons/md';

const Error = ({
  error,
  reset,
}: {
  reset: () => void;
  error: { message: string; reset: () => void; digest: string };
}) => {
  console.error({ error });

  return (
    <div
      style={{
        background: `rgb(0 0 0 / .5) url(/assets/imgs/shaka-banner.jpeg)`,
      }}
      className="flex items-center justify-center h-screen "
    >
      <div className="flex items-center justify-center h-screen bg-black/70 w-full">
        <div className="text-center p-4 rounded-lg shadow-lg bg-base-100 m-1">
          <div className="text-red-600">
            <AiOutlineWarning size={64} className="mx-auto mb-4" />
            <h1 className="text-xl md:text-3xl font-semibold mb-2">
              Oops! Something went wrong.
            </h1>
            <p className="text-gray-600 mb-4">
              An error occurred. Please try again later.
            </p>
            {/* {statusCode && (
            <p className="text-gray-600">Status Code: {statusCode}</p>
          )} */}
          </div>
          <Link
            href="/"
            onClick={() =>
              reset ? reset() : error.reset ? error.reset() : null
            }
            className="mt-4 inline-block px-4 py-2 btn-secondary rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          >
            <MdHome className="inline-block mr-2" />
            <span>Go back home</span>
          </Link>
        </div>
      </div>
    </div>
    // <div
    //   style={{ backgroundImage: `url(/assets/imgs/shaka-banner.jpeg)` }}
    //   className="bg-cover bg-center h-screen w-screen flex justify-center items-center"
    // >
    //   <div className="absolute inset-0 bg-black/50 h-full-w-full" />
    //   <div className="min-w-[60%] flex flex-col gap-3 justify-center min-h-[300px] p-4 bg-white rounded-lg shadow-lg">
    //         <h1 className="text-xl font-bold flex items-center gap-2 text-center">
    //         <MdError /> <span>Error Occured</span>
    //         </h1>
    //         <p className="alert alert-error">
    //         {' '}
    //         <MdError /> Something went wrong
    //         </p>
    //     <Link href="/" className="btn self-center btn-secondary">
    //       <MdHome /> Go home
    //     </Link>
    //   </div>
    // </div>
  );
};

export default Error;
