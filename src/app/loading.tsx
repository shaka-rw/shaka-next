import Navbar from '@/components/server/Navbar';
import React from 'react';

const LoadingPage = () => {
  return (
    <div>
      <Navbar />
      <div className="flex gap-2 flex-wrap container mx-auto my-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="bg-base-200 animate-pulse aspect-square w-48 h-48 shadow rounded"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingPage;
