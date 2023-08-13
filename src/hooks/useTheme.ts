import { useEffect, useMemo, useState, useTransition } from 'react';
import { changeTheme as changeUserTheme } from '../app/_actions/theme';
import { useSession } from 'next-auth/react';

export type Theme = {
  name: 'shaka-light' | 'shaka-dark';
};

const useTheme = () => {
  const [isPending, startTransition] = useTransition();
  const session = useSession();
  const [currentTheme, setCurrentTheme] = useState<Theme['name'] | null>(
    (session?.data?.user as any)?.theme === 'DARK' ? 'shaka-dark' : 'shaka-light'
  );

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
    if (currentTheme &&  session?.status !== "loading") {
      document
        .getElementsByTagName('html')[0]
        ?.setAttribute('data-theme', currentTheme);
      startTransition(() =>
        changeUserTheme(currentTheme === 'shaka-dark' ? 'DARK' : 'LIGHT')
      );
    }
  }, [currentTheme, session?.status]);

  const changeTheme = (value: Theme['name']) => {
    if (themes.some((t) => t.name === value)) {
      localStorage.setItem('theme', value);
      setCurrentTheme(value);
    }
  };

  return { themes, changeTheme, currentTheme };
};

export default useTheme;
