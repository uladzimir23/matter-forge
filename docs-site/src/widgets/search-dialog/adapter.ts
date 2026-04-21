export type SearchHit = {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  section?: string;
};

export interface SearchAdapter {
  load(): Promise<void>;
  search(query: string, signal?: AbortSignal): Promise<SearchHit[]>;
}
