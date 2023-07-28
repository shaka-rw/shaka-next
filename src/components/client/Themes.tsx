'use client';

import React, { useEffect, useState } from 'react';

const Themes = () => {
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);

  useEffect(() => {
    let theme = localStorage.getItem('theme');
    theme =
      theme ??
      document.getElementsByTagName('html')[0]?.dataset.theme ??
      'light';
    localStorage.setItem('theme', theme);
    setCurrentTheme(theme);
  }, []);

  useEffect(() => {
    if (currentTheme) {
      document
        .getElementsByTagName('html')[0]
        ?.setAttribute('data-theme', currentTheme);
    }
  }, [currentTheme]);

  const themes: { name: string }[] = [
    { name: 'light' },
    { name: 'dark' },
    { name: 'luxury' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    console.log({ value });
    if (themes.some((t) => t.name === value)) {
      localStorage.setItem('theme', value);
      setCurrentTheme(value);
    }
  };
  return (
    <div className="flex shadow border gap-2 items-stretch flex-col p-2 m-1">
      {themes.map((theme) => (
        <div key={theme.name} className="form-control w-full btn">
          <label className="label flex gap-2 w-full  cursor-pointer">
            <span className="label-text">{theme.name}</span>
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

export default Themes;
