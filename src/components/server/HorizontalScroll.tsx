import React, { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import HorizontalScrollButtons from '../client/HorizontalScrollButtons';

const HorizontalScroll = ({
  speed = 200,
  className = '',
  children,
}: PropsWithChildren<{ className?: string; speed?: number }>) => {
  return (
    <div
      className={twMerge(
        'flex w-full items-center gap-1 md:gap-2 overflow-x-auto bg-base-300 p-2 md:p-4',
        className
      )}
    >
      <HorizontalScrollButtons speed={speed}>
        {children}
      </HorizontalScrollButtons>
    </div>
  );
};

export default HorizontalScroll;
