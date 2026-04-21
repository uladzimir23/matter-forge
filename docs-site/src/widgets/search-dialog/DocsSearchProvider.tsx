'use client';

import { useMemo } from 'react';
import { SearchProvider } from './context';
import { createPagefindAdapter } from './pagefind-adapter';

export function DocsSearchProvider({ children }: { children: React.ReactNode }) {
  const adapter = useMemo(
    () => createPagefindAdapter('/pagefind/pagefind.js'),
    [],
  );
  return <SearchProvider adapter={adapter}>{children}</SearchProvider>;
}
