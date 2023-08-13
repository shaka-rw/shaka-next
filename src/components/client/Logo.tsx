'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import useLogo from '@/hooks/useLogo';

const Logo = ({
  width,
  height,
  className = '',
}: {
  width: number;
  height: number;
  className?: string;
}) => {
  const initUrl = useLogo();
  const [logoURL, setLogoURL] = useState<'logo_.png' | 'logo.png'>(initUrl);

  useEffect(() => {
    setLogoURL(initUrl);
  }, [initUrl]);

  return (
    <Image
      alt="Shaka Logo"
      width={width}
      height={height}
      src={`/${logoURL}`}
      className={className}
    />
  );
};

export default Logo;
