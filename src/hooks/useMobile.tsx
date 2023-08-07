'use client';
import { useEffect, useState } from 'react';

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);
  return isMobile;
};

export default useMobile;
