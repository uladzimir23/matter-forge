import { AlertTriangle, AlertCircle, Info, CheckCircle2, StickyNote } from 'lucide-react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Callout.module.scss';

export type CalloutType = 'danger' | 'warning' | 'info' | 'success' | 'note';

const icons: Record<CalloutType, typeof AlertTriangle> = {
  danger: AlertTriangle,
  warning: AlertCircle,
  info: Info,
  success: CheckCircle2,
  note: StickyNote,
};

export function Callout({ type = 'info', title, children }: {
  type?: CalloutType;
  title?: ReactNode;
  children: ReactNode;
}) {
  const Icon = icons[type];
  return (
    <div className={clsx(styles.root, styles[type])} role="note">
      <Icon className={styles.icon} size={20} strokeWidth={2} aria-hidden />
      <div className={styles.body}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
