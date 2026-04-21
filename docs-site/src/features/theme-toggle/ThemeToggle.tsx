'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import styles from './ThemeToggle.module.scss';

type Theme = 'light' | 'dark' | 'system';
const KEY = 'matter-forge-theme';

const OPTIONS = [
  { value: 'light', label: 'Светлая тема', Icon: Sun },
  { value: 'dark', label: 'Тёмная тема', Icon: Moon },
  { value: 'system', label: 'Системная тема', Icon: Monitor },
] as const;

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    root.removeAttribute('data-theme');
    root.classList.remove('dark');
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.classList.add('dark');
    }
  } else {
    root.setAttribute('data-theme', theme);
    root.classList.toggle('dark', theme === 'dark');
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as Theme) || 'system';
    setTheme(saved);
    applyTheme(saved);
    setMounted(true);

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const cur = (localStorage.getItem(KEY) as Theme) || 'system';
      if (cur === 'system') applyTheme('system');
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const select = (next: Theme) => {
    localStorage.setItem(KEY, next);
    setTheme(next);
    applyTheme(next);
  };

  if (!mounted) {
    return <div className={styles.placeholder} aria-hidden />;
  }

  return (
    <div className={styles.root} role="group" aria-label="Переключатель темы">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={theme === value}
          onClick={() => select(value)}
          className={`${styles.option} ${theme === value ? styles.optionActive : ''}`.trim()}
        >
          <Icon className={styles.icon} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
