'use client';

import useTheme, { Theme } from '@/hooks/useTheme';
import React from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

const Themes = () => {
  const { themes, currentTheme, changeTheme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    changeTheme(value as Theme['name']);
  };

  return (
    <div className="flex shadow border gap-2 items-stretch flex-col p-2 m-1">
      {themes.map((theme) => (
        <div key={theme.name} className="form-control w-full btn">
          <label className="label flex gap-2 w-full  cursor-pointer">
            <span className="label-text capitalize">
              {theme.name.split('-')[1]}
            </span>
            <input
              type="radio"
              name="radio-10"
              value={theme.name}
              className="radio checked:bg-yellow-500"
              defaultChecked={currentTheme === theme.name}
              onChange={handleChange}
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export const ThemeButton = () => {
  const { themes, currentTheme, changeTheme } = useTheme();

  const handleChange = (value: Theme['name']) => {
    changeTheme(value);
  };

  return (
    <button
      onClick={() =>
        handleChange(
          currentTheme === 'shaka-dark' ? 'shaka-light' : 'shaka-dark'
        )
      }
      className="btn btn-circle btn-sm md:btn-md text-lg"
    >
      {' '}
      {currentTheme === 'shaka-dark' ? <MdLightMode /> : <MdDarkMode />}{' '}
    </button>
  );
};

export default Themes;
