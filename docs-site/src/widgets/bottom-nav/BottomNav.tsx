'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Search } from 'lucide-react';
import clsx from 'clsx';
import { NavSheet } from '@/widgets/nav-sheet/NavSheet';
import { useSearchDialog } from '@/widgets/search-dialog/context';
import type { NavNode } from '@/shared/lib/docs';
import styles from './BottomNav.module.scss';

export function BottomNav({
  nav,
  currentTitle,
}: {
  nav: NavNode[];
  currentTitle?: string;
}) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { setOpen: setSearchOpen } = useSearchDialog();

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        if (Math.abs(delta) > 6) {
          if (delta > 0 && y > 80) setHidden(true);
          else if (delta < 0) setHidden(false);
          lastY = y;
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = pathname === '/';

  return (
    <>
      <nav
        className={clsx(styles.root, hidden && styles.hidden)}
        aria-label="Основная навигация"
      >
        <Link
          href="/"
          className={clsx(styles.tab, isHome && styles.active)}
          aria-label="Главная"
        >
          <Home size={22} strokeWidth={2} />
          <span className={styles.label}>Главная</span>
        </Link>
        <button
          type="button"
          className={clsx(styles.tab, sheetOpen && styles.active)}
          onClick={() => setSheetOpen(true)}
          aria-label="Разделы"
        >
          <BookOpen size={22} strokeWidth={2} />
          <span className={styles.label}>Разделы</span>
        </button>
        <button
          type="button"
          className={styles.tab}
          onClick={() => setSearchOpen(true)}
          aria-label="Поиск"
        >
          <Search size={22} strokeWidth={2} />
          <span className={styles.label}>Поиск</span>
        </button>
      </nav>

      <NavSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        nav={nav}
        currentTitle={currentTitle}
      />
    </>
  );
}
