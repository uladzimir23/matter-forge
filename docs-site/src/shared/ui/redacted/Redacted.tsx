import type { ReactNode } from 'react';
import styles from './Redacted.module.scss';

export function Redacted({ children }: { children: ReactNode }) {
  return <span className={styles.root} aria-label="Скрытое значение">{children}</span>;
}
