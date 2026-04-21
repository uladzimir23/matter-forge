import type { SearchAdapter, SearchHit } from './adapter';

type PagefindResult = {
  id: string;
  data: () => Promise<{
    url: string;
    meta: { title?: string };
    excerpt: string;
  }>;
};

type PagefindAPI = {
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
};

export function createPagefindAdapter(
  bundleUrl = '/pagefind/pagefind.js',
  limit = 10,
): SearchAdapter {
  let pagefind: PagefindAPI | null = null;
  let loading: Promise<void> | null = null;

  const ensureLoaded = (): Promise<void> => {
    if (pagefind) return Promise.resolve();
    if (!loading) {
      loading = import(/* webpackIgnore: true */ bundleUrl)
        .then((m) => {
          pagefind = m as PagefindAPI;
        })
        .catch((err) => {
          loading = null;
          throw err;
        });
    }
    return loading;
  };

  return {
    async load() {
      try {
        await ensureLoaded();
      } catch {
        // dev: pagefind bundle не собран — игнорируем, search вернёт []
      }
    },
    async search(query) {
      await this.load();
      if (!pagefind || !query.trim()) return [];
      const res = await pagefind.search(query);
      const data = await Promise.all(
        res.results.slice(0, limit).map((r) => r.data()),
      );
      return data.map((d, i): SearchHit => ({
        id: String(i),
        url: d.url,
        title: d.meta.title || d.url,
        excerpt: d.excerpt,
      }));
    },
  };
}
