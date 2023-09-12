'use client';
import Link from '@/components/server/Link';
import React from 'react';
import { MdHome } from 'react-icons/md';

const NotFoundPage = () => {
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
            <span className="inline-block text-6xl font-extrabold">404</span>
            <h1 className="text-xl md:text-3xl font-semibold mb-2">
              Page not found!
            </h1>
            <p className="text-gray-600 mb-4">
              They page you&apos;re looking for doesn&apos;t exist, has been
              removed or is broken.
            </p>
          </div>
          <Link
            href="/"
            className="mt-4 inline-block px-4 py-2 btn-secondary rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          >
            <MdHome className="inline-block mr-2" />
            <span>Go back home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
