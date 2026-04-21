import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, sep, basename, extname } from 'node:path';
import matter from 'gray-matter';

const DOCS_DIR = join(process.cwd(), '..', 'docs');

export type DocFrontmatter = {
  title?: string;
  description?: string;
  order?: number;
  tags?: string[];
  status?: string;
  category?: string;
  date?: string;
  [key: string]: unknown;
};

export type Doc = {
  slug: string[];           // ['audit', 'что-сломано']
  slugStr: string;           // 'audit/что-сломано'
  url: string;               // '/audit/что-сломано'
  filepath: string;          // absolute path to source
  filename: string;          // 'Что сломано.mdx'
  title: string;
  description?: string;
  order: number;
  frontmatter: DocFrontmatter;
  content: string;
  excerpt?: string;
};

export type NavNode = {
  title: string;
  url?: string;               // если есть страница
  order: number;
  folder?: string;            // '20 - Audit' для папок
  children?: NavNode[];
  isActive?: boolean;
};

// --- Slug helpers ---

export function stripCategoryPrefix(name: string): string {
  // '20 - Audit' → 'Audit', '42 - ADR' → 'ADR', '2026-04-17 ...' остаётся
  // Префикс категории — это "NN - " в начале
  return name.replace(/^\d{2}\s*-\s*/, '');
}

const TRANSLIT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh',
  з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
  п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts',
  ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu',
  я: 'ya',
};

function transliterate(s: string): string {
  return s
    .split('')
    .map((ch) => {
      const lower = ch.toLowerCase();
      const mapped = TRANSLIT[lower];
      return mapped !== undefined ? mapped : ch;
    })
    .join('');
}

export function slugify(s: string): string {
  return transliterate(stripCategoryPrefix(s))
    .toLowerCase()
    .replace(/\.(mdx?|md)$/i, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isDocFile(name: string): boolean {
  return /\.(mdx|md)$/i.test(name) && !name.startsWith('.') && name.toLowerCase() !== 'readme.md';
}

// --- Walk docs dir ---

const EXCLUDED_DIRS = new Set(['80 - Templates', '95 - Attachments', 'snapshots']);

async function walk(dir: string, collected: string[] = []): Promise<string[]> {
  const entries = await readdir(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    const s = await stat(full);
    if (s.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry)) continue;
      await walk(full, collected);
    } else if (isDocFile(entry)) {
      collected.push(full);
    }
  }
  return collected;
}

// --- Public API ---

export async function getAllDocs(): Promise<Doc[]> {
  const files = await walk(DOCS_DIR);
  const docs: Doc[] = [];

  for (const filepath of files) {
    const raw = await readFile(filepath, 'utf-8');
    const { data, content } = matter(raw);
    const filename = basename(filepath);
    const rel = relative(DOCS_DIR, filepath);

    // Path parts without filename
    const parts = rel.split(sep);
    const fileBase = parts.pop()!.replace(extname(parts.length > 0 ? filename : filename), '').replace(/\.(mdx|md)$/i, '');

    // Slug — stripping category prefix at each level
    const slug = [
      ...parts.map(slugify).filter(Boolean),
      slugify(fileBase),
    ];

    // Special: Dashboard → /
    const isDashboard = fileBase.toLowerCase() === 'dashboard';
    const finalSlug = isDashboard ? [] : slug;

    const fm = data as DocFrontmatter;
    const title = fm.title || fileBase;

    docs.push({
      slug: finalSlug,
      slugStr: finalSlug.join('/'),
      url: '/' + finalSlug.join('/'),
      filepath,
      filename,
      title,
      description: fm.description,
      order: typeof fm.order === 'number' ? fm.order : 999,
      frontmatter: fm,
      content,
      excerpt: content.slice(0, 200).replace(/[#*`_\[\]]/g, '').trim(),
    });
  }

  docs.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'ru'));
  return docs;
}

export async function getDocBySlug(slug: string[]): Promise<Doc | null> {
  const docs = await getAllDocs();
  const target = slug.join('/');
  return docs.find((d) => d.slugStr === target) || null;
}

// --- Navigation tree ---

export async function getNavTree(): Promise<NavNode[]> {
  const docs = await getAllDocs();

  // Группируем по папкам верхнего уровня
  const byFolder = new Map<string, Doc[]>();
  const rootDocs: Doc[] = [];

  for (const doc of docs) {
    const rel = relative(DOCS_DIR, doc.filepath);
    const parts = rel.split(sep);

    if (parts.length === 1) {
      rootDocs.push(doc);
    } else {
      const folder = parts[0];
      if (!byFolder.has(folder)) byFolder.set(folder, []);
      byFolder.get(folder)!.push(doc);
    }
  }

  // Парсим порядок папки из префикса
  const folderOrder = (folder: string): number => {
    const m = folder.match(/^(\d{2})\s*-/);
    return m ? parseInt(m[1], 10) : 999;
  };

  const tree: NavNode[] = [];

  // Root-level docs first (Dashboard.md → / )
  for (const doc of rootDocs) {
    tree.push({
      title: doc.title,
      url: doc.url,
      order: doc.order,
    });
  }

  // Folders
  const folders = Array.from(byFolder.keys()).sort(
    (a, b) => folderOrder(a) - folderOrder(b),
  );

  for (const folder of folders) {
    const folderName = stripCategoryPrefix(folder);
    const folderDocs = byFolder.get(folder)!;

    folderDocs.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'ru'));

    tree.push({
      title: folderName,
      folder,
      order: folderOrder(folder),
      children: folderDocs.map((d) => ({
        title: d.title,
        url: d.url,
        order: d.order,
      })),
    });
  }

  return tree;
}
