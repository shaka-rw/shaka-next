import Navbar from '@/components/server/Navbar';
import React, { Suspense } from 'react';

const LoadingPage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="h-14 bg-base-100 w-full flex items-center justify-center border-b border-base-content animate-pulse">
            <div className="loading loading-sm" />
          </div>
        }
      >
        <Navbar />
      </Suspense>
      <div className="progress w-full container mx-auto mt-1" />
      <div className="flex gap-2 flex-wrap container mx-auto my-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="bg-base-200 flex items-center justify-center animate-pulse aspect-square w-48 h-48 shadow rounded"
          >
            <div className="loading loading-infinity" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingPage;
