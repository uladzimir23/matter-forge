'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './Bottomsheet.module.scss';

export type SnapPoint = number; // 0..1 — доля viewport height

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  children: ReactNode;
  /**
   * Snap points в долях от высоты viewport.
   * Примеры: [0.5, 0.9] — откр на 50%, можно дотянуть до 90%.
   * Первое значение — initial snap.
   */
  snapPoints?: SnapPoint[];
  /** Показывать ли "hand" drag handle сверху */
  showHandle?: boolean;
  /** Показывать ли крестик закрытия */
  showClose?: boolean;
  /** Фиксированный desktop width (px). 0 = full-screen. */
  desktopMaxWidth?: number;
};

export function Bottomsheet({
  open,
  onOpenChange,
  title,
  children,
  snapPoints = [0.5, 0.9],
  showHandle = true,
  showClose = true,
  desktopMaxWidth = 600,
}: Props) {
  const [currentSnap, setCurrentSnap] = useState<number>(snapPoints[0]);
  const y = useMotionValue(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const vh = useRef<number>(typeof window !== 'undefined' ? window.innerHeight : 800);

  // Обновляем vh при resize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => { vh.current = window.innerHeight; };
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Reset snap при открытии
  useEffect(() => {
    if (open) {
      setCurrentSnap(snapPoints[0]);
      y.set(0);
    }
  }, [open, snapPoints, y]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = orig; };
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  const height = Math.round(vh.current * currentSnap);
  const backdropOpacity = useTransform(y, [-50, 0, 200], [1, 1, 0.3]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const offsetY = info.offset.y;
      const velocityY = info.velocity.y;

      // Если свайп вниз с достаточной скоростью — закрыть или на нижний snap
      if (velocityY > 600 || offsetY > height * 0.5) {
        // find lower snap or close
        const lower = [...snapPoints].reverse().find((s) => s < currentSnap);
        if (lower !== undefined) {
          setCurrentSnap(lower);
          y.set(0);
        } else {
          onOpenChange(false);
        }
        return;
      }

      // Если свайп вверх
      if (velocityY < -400 || offsetY < -height * 0.15) {
        const higher = snapPoints.find((s) => s > currentSnap);
        if (higher !== undefined) {
          setCurrentSnap(higher);
          y.set(0);
          return;
        }
      }

      // Возврат к текущему snap
      y.set(0);
    },
    [currentSnap, snapPoints, onOpenChange, height, y],
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onOpenChange(false)}
            style={{ opacity: backdropOpacity }}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === 'string' ? title : 'Диалог'}
            style={{
              height,
              y,
              maxWidth: desktopMaxWidth ? `${desktopMaxWidth}px` : undefined,
            }}
            initial={{ y: vh.current }}
            animate={{ y: 0 }}
            exit={{ y: vh.current }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: -50, bottom: vh.current }}
            dragElastic={{ top: 0.05, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
          >
            {showHandle && (
              <div className={styles.handle} aria-hidden>
                <span />
              </div>
            )}

            {(title || showClose) && (
              <header className={styles.header}>
                {title ? <div className={styles.title}>{title}</div> : <span />}
                {showClose && (
                  <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={() => onOpenChange(false)}
                    aria-label="Закрыть"
                  >
                    <X size={20} />
                  </button>
                )}
              </header>
            )}

            <div className={styles.content}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
