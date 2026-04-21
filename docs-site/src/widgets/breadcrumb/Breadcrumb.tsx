import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import styles from './Breadcrumb.module.scss';

export type Crumb = { title: string; url?: string };

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length === 0) return null;

  return (
    <nav className={styles.root} aria-label="Хлебные крошки">
      <Link href="/" className={styles.home} aria-label="Главная">
        <Home size={14} strokeWidth={2} />
      </Link>
      {crumbs.map((c, i) => (
        <span key={i} className={styles.item}>
          <ChevronRight size={14} className={styles.sep} />
          {c.url ? (
            <Link href={c.url}>{c.title}</Link>
          ) : (
            <span className={styles.current}>{c.title}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
