import { Theme as UserTheme } from '@prisma/client';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { changeTheme as changeUserTheme } from '../app/_actions/theme';

export type Theme = {
  name: 'shaka-light' | 'shaka-dark';
};

const useTheme = () => {
  const [isPending, startTransition] = useTransition();
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
      startTransition(() =>
        changeUserTheme(
          currentTheme === 'shaka-dark' ? UserTheme.DARK : UserTheme.LIGHT
        )
      );
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
