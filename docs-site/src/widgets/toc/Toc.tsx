'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './Toc.module.scss';

type Heading = { id: string; text: string; level: number };

export function Toc() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('main h2[id], main h3[id]')
    );
    setHeadings(
      nodes.map((el) => ({
        id: el.id,
        text: el.textContent || '',
        level: Number(el.tagName.slice(1)),
      }))
    );

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0% -60% 0%', threshold: 0 }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <aside className={styles.root} aria-label="Оглавление">
      <div className={styles.label}>На этой странице</div>
      <ul className={styles.list}>
        {headings.map((h) => (
          <li
            key={h.id}
            className={clsx(
              styles.item,
              h.level === 3 && styles.sub,
              activeId === h.id && styles.active
            )}
          >
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
