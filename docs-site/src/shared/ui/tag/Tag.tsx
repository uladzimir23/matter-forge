import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Tag.module.scss';

export type TagColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'gray';

export function Tag({ color = 'gray', children }: {
  color?: TagColor;
  children: ReactNode;
}) {
  return (
    <span className={clsx(styles.root, styles[color])}>
      {children}
    </span>
  );
}
