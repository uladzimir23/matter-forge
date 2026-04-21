import Link from 'next/link';
import { ThemeToggle } from '@/features/theme-toggle/ThemeToggle';
import { SearchBar } from '@/widgets/search-bar/SearchBar';
import styles from './Topbar.module.scss';

export function Topbar({ basePath = '' }: { basePath?: string }) {
  const home = basePath || '/';
  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <Link href={home} className={styles.brand}>
          <span className={styles.brandMark} aria-hidden>◆</span>
          <span className={styles.brandName}>Matter Forge</span>
          <span className={styles.brandSub}>docs</span>
        </Link>
        <div className={styles.actions}>
          <SearchBar />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
