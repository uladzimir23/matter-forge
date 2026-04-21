'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { Bottomsheet } from '@/shared/ui/bottomsheet/Bottomsheet';
import type { NavNode } from '@/shared/lib/docs';
import styles from './NavSheet.module.scss';

export function NavSheet({
  open,
  onOpenChange,
  nav,
  currentTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nav: NavNode[];
  currentTitle?: string;
}) {
  const pathname = usePathname();

  return (
    <Bottomsheet
      open={open}
      onOpenChange={onOpenChange}
      title={currentTitle ? `📍 ${currentTitle}` : 'Разделы'}
      snapPoints={[0.5, 0.9]}
    >
      <div className={styles.sectionLabel}>Все разделы</div>
      <nav className={styles.nav}>
        {nav.map((node) => (
          <NavItem key={node.url || node.folder} node={node} pathname={pathname} onClick={() => onOpenChange(false)} />
        ))}
      </nav>
    </Bottomsheet>
  );
}

function NavItem({
  node,
  pathname,
  onClick,
}: {
  node: NavNode;
  pathname: string;
  onClick: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  if (node.url !== undefined) {
    const isActive = pathname === node.url;
    return (
      <Link
        href={node.url}
        className={clsx(styles.link, styles.topLink, isActive && styles.active)}
        onClick={onClick}
      >
        {node.title}
      </Link>
    );
  }

  if (!node.children) return null;

  return (
    <div className={styles.group}>
      <button
        type="button"
        className={styles.groupHeader}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <ChevronRight
          size={14}
          strokeWidth={2.5}
          className={clsx(styles.chevron, expanded && styles.chevronOpen)}
        />
        <span>{node.title}</span>
      </button>
      {expanded && (
        <ul className={styles.items}>
          {node.children.map((child) => {
            const isActive = pathname === child.url;
            return (
              <li key={child.url}>
                <Link
                  href={child.url!}
                  className={clsx(styles.link, isActive && styles.active)}
                  onClick={onClick}
                >
                  {child.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
