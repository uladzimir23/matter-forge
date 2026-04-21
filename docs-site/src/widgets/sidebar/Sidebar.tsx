'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import type { NavNode } from '@/shared/lib/docs';
import styles from './Sidebar.module.scss';

export function Sidebar({ nav }: { nav: NavNode[] }) {
  return (
    <aside className={styles.root} aria-label="Навигация">
      <nav className={styles.nav}>
        {nav.map((node) => (
          <NavGroup key={node.url || node.folder} node={node} />
        ))}
      </nav>
    </aside>
  );
}

function NavGroup({ node }: { node: NavNode }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  if (node.url !== undefined) {
    // Root-level link (без children)
    const isActive = pathname === node.url || (node.url === '/' && pathname === '/');
    return (
      <Link
        href={node.url}
        className={clsx(styles.link, styles.topLink, isActive && styles.active)}
      >
        {node.title}
      </Link>
    );
  }

  if (!node.children || node.children.length === 0) return null;

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
          className={clsx(styles.chevron, expanded && styles.chevronOpen)}
          strokeWidth={2.5}
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
