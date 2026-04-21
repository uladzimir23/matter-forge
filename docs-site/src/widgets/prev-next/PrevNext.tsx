import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './PrevNext.module.scss';

export type PrevNextLink = { title: string; url: string };

export function PrevNext({
  prev,
  next,
}: {
  prev?: PrevNextLink;
  next?: PrevNextLink;
}) {
  if (!prev && !next) return null;

  return (
    <nav className={styles.root} aria-label="Навигация по страницам">
      {prev ? (
        <Link href={prev.url} className={`${styles.card} ${styles.prev}`}>
          <ChevronLeft size={18} className={styles.icon} />
          <span className={styles.inner}>
            <span className={styles.label}>Предыдущая</span>
            <span className={styles.title}>{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.url} className={`${styles.card} ${styles.next}`}>
          <span className={styles.inner}>
            <span className={styles.label}>Следующая</span>
            <span className={styles.title}>{next.title}</span>
          </span>
          <ChevronRight size={18} className={styles.icon} />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
