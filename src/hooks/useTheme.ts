import { useEffect, useMemo, useState } from 'react';

export type Theme = {
  name: 'shaka-light' | 'shaka-dark';
};

const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme['name'] | null>(null);

  const themes: Theme[] = useMemo(
    () => [{ name: 'shaka-light' }, { name: 'shaka-dark' }],
    []
  );

  useEffect(() => {
    let theme = localStorage.getItem('theme');
    theme =
      theme ??
      document.getElementsByTagName('html')[0]?.dataset.theme ??
      'shaka-light';
    if (!themes.some((t) => t.name === theme)) {
      theme = 'shaka-light';
    }

    localStorage.setItem('theme', theme);
    setCurrentTheme(theme as Theme['name']);
  }, [themes]);

  useEffect(() => {
    if (currentTheme) {
      document
        .getElementsByTagName('html')[0]
        ?.setAttribute('data-theme', currentTheme);
    }
  }, [currentTheme]);

  const changeTheme = (value: Theme['name']) => {
    if (themes.some((t) => t.name === value)) {
      localStorage.setItem('theme', value);
      setCurrentTheme(value);
    }
  };

  return { themes, changeTheme, currentTheme };
};

export default useTheme;
