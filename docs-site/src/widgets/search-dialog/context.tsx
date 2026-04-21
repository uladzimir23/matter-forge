'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { SearchAdapter } from './adapter';
import { SearchDialog } from './SearchDialog';

type SearchContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  preload: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({
  adapter,
  children,
}: {
  adapter: SearchAdapter;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const preload = useCallback(() => {
    void adapter.load();
  }, [adapter]);

  const value = useMemo<SearchContextValue>(
    () => ({ open, setOpen, toggle, preload }),
    [open, toggle, preload],
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
      <SearchDialog open={open} onOpenChange={setOpen} adapter={adapter} />
    </SearchContext.Provider>
  );
}

export function useSearchDialog(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error('useSearchDialog must be used inside <SearchProvider>');
  }
  return ctx;
}
