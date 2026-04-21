'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useSearchDialog } from '@/widgets/search-dialog/context';
import styles from './SearchBar.module.scss';

export function SearchBar() {
  const { setOpen, toggle, preload } = useSearchDialog();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(navigator.platform));

    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
        return;
      }
      if (e.key === '/' && !isEditing(e.target)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, setOpen]);

  return (
    <button
      type="button"
      className={styles.trigger}
      onClick={() => setOpen(true)}
      onMouseEnter={preload}
      onFocus={preload}
      aria-label="Открыть поиск по документации"
    >
      <Search size={16} className={styles.icon} aria-hidden />
      <span className={styles.label}>Поиск…</span>
      <kbd className={styles.kbd} aria-hidden>
        {isMac ? '⌘' : 'Ctrl'} K
      </kbd>
    </button>
  );
}

function isEditing(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
}
