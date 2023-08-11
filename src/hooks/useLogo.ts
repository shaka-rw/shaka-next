import React from 'react';
import useTheme from './useTheme';

const useLogo = () => {
  const { currentTheme } = useTheme();

  return currentTheme === 'shaka-dark' ? 'logo_.png' : 'logo.png';
};

export default useLogo;
