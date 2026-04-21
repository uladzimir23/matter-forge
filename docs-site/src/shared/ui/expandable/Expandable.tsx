'use client';

import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Bottomsheet } from '../bottomsheet/Bottomsheet';
import styles from './Expandable.module.scss';

export function Expandable({
  title,
  maxHeight = 320,
  children,
}: {
  title?: ReactNode;
  maxHeight?: number;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [needsClip, setNeedsClip] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewRef.current) return;
    const h = previewRef.current.scrollHeight;
    setNeedsClip(h > maxHeight);
  }, [children, maxHeight]);

  return (
    <>
      <div className={styles.root}>
        {title && <div className={styles.title}>{title}</div>}
        <div
          ref={previewRef}
          className={styles.preview}
          style={{ maxHeight: `${maxHeight}px` }}
        >
          {children}
          {needsClip && <div className={styles.fade} aria-hidden />}
        </div>
        {needsClip && (
          <button
            type="button"
            className={styles.expandBtn}
            onClick={() => setIsOpen(true)}
          >
            Читать полностью
            <ChevronDown size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <Bottomsheet
        open={isOpen}
        onOpenChange={setIsOpen}
        title={title}
        snapPoints={[0.5, 0.9]}
      >
        <div className={styles.fullContent}>{children}</div>
      </Bottomsheet>
    </>
  );
}
