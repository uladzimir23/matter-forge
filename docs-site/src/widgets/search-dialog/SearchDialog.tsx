'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Search } from 'lucide-react';
import type { SearchAdapter, SearchHit } from './adapter';
import styles from './SearchDialog.module.scss';

const DEBOUNCE_MS = 120;

export function SearchDialog({
  open,
  onOpenChange,
  adapter,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adapter: SearchAdapter;
}) {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const listboxId = useId();

  useEffect(() => {
    if (open) void adapter.load();
  }, [open, adapter]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setHits([]);
      setActiveIndex(0);
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q) {
      setHits([]);
      setActiveIndex(0);
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const r = await adapter.search(q, ctrl.signal);
        if (!ctrl.signal.aborted) {
          setHits(r);
          setActiveIndex(0);
          setLoading(false);
        }
      } catch {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [query, open, adapter]);

  useEffect(() => {
    if (hits.length === 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-hit-index="${activeIndex}"]`,
    );
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, hits.length]);

  const go = useCallback(
    (url: string) => {
      onOpenChange(false);
      router.push(url);
    },
    [onOpenChange, router],
  );

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (hits.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % hits.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + hits.length) % hits.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(hits.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = hits[activeIndex];
      if (hit) go(hit.url);
    }
  };

  const activeId = hits.length > 0 ? `${listboxId}-hit-${activeIndex}` : undefined;
  const statusText = loading
    ? 'Ищу…'
    : !query.trim()
    ? ''
    : hits.length === 0
    ? 'Ничего не найдено'
    : `Найдено ${hits.length}`;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.panel}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
        >
          <VisuallyHidden asChild>
            <Dialog.Title>Поиск по документации</Dialog.Title>
          </VisuallyHidden>
          <VisuallyHidden asChild>
            <Dialog.Description>
              Введите запрос. Стрелки ↑↓ для навигации, Enter — перейти, Esc —
              закрыть.
            </Dialog.Description>
          </VisuallyHidden>

          <div className={styles.inputRow}>
            <Search size={18} className={styles.searchIcon} aria-hidden />
            <input
              ref={inputRef}
              className={styles.input}
              placeholder="Поиск по документации…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKey}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={hits.length > 0}
              aria-controls={listboxId}
              aria-activedescendant={activeId}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>

          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            className={styles.results}
            aria-label="Результаты поиска"
          >
            {hits.map((h, i) => {
              const isActive = i === activeIndex;
              return (
                <Link
                  key={h.id}
                  id={`${listboxId}-hit-${i}`}
                  data-hit-index={i}
                  href={h.url}
                  role="option"
                  aria-selected={isActive}
                  className={`${styles.hit} ${isActive ? styles.hitActive : ''}`.trim()}
                  onClick={() => onOpenChange(false)}
                  onMouseMove={() => setActiveIndex(i)}
                >
                  <div className={styles.hitTitle}>{h.title}</div>
                  <div
                    className={styles.hitExcerpt}
                    dangerouslySetInnerHTML={{ __html: h.excerpt }}
                  />
                </Link>
              );
            })}
            {!loading && query.trim() && hits.length === 0 && (
              <div className={styles.state}>Ничего не найдено</div>
            )}
            {loading && hits.length === 0 && (
              <div className={styles.state}>Поиск…</div>
            )}
            {!query.trim() && (
              <div className={styles.state}>Начните вводить запрос</div>
            )}
          </div>

          <div role="status" aria-live="polite" className={styles.srOnly}>
            {statusText}
          </div>

          <div className={styles.hints} aria-hidden>
            <span>
              <kbd className={styles.kbd}>↑</kbd>
              <kbd className={styles.kbd}>↓</kbd>
              навигация
            </span>
            <span>
              <kbd className={styles.kbd}>↵</kbd>
              открыть
            </span>
            <span>
              <kbd className={styles.kbd}>esc</kbd>
              закрыть
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
