import { getAllDocs, getNavTree } from '@/shared/lib/docs';
import type { Doc, NavNode } from '@/shared/lib/docs';
import { RenderMdx } from '@/shared/lib/mdx-render';
import { Breadcrumb } from '@/widgets/breadcrumb/Breadcrumb';
import type { Crumb } from '@/widgets/breadcrumb/Breadcrumb';
import { Toc } from '@/widgets/toc/Toc';
import { PrevNext } from '@/widgets/prev-next/PrevNext';
import styles from './DocPage.module.scss';

function buildCrumbs(doc: Doc, nav: NavNode[]): Crumb[] {
  if (doc.slug.length === 0) return [];

  const crumbs: Crumb[] = [];
  for (const node of nav) {
    if (node.children?.some((c) => c.url === doc.url)) {
      crumbs.push({ title: node.title });
      break;
    }
  }
  crumbs.push({ title: doc.title });
  return crumbs;
}

function findPrevNext(doc: Doc, allDocs: Doc[]) {
  const idx = allDocs.findIndex((d) => d.slugStr === doc.slugStr);
  if (idx === -1) return { prev: undefined, next: undefined };
  const prevDoc = idx > 0 ? allDocs[idx - 1] : undefined;
  const nextDoc = idx < allDocs.length - 1 ? allDocs[idx + 1] : undefined;
  return {
    prev: prevDoc ? { title: prevDoc.title, url: prevDoc.url } : undefined,
    next: nextDoc ? { title: nextDoc.title, url: nextDoc.url } : undefined,
  };
}

export async function DocPage({ doc }: { doc: Doc }) {
  const [nav, allDocs] = await Promise.all([getNavTree(), getAllDocs()]);
  const crumbs = buildCrumbs(doc, nav);
  const { prev, next } = findPrevNext(doc, allDocs);

  return (
    <div className={styles.root}>
      <article className={styles.article}>
        <Breadcrumb crumbs={crumbs} />
        <header className={styles.header}>
          <h1 className={styles.title}>{doc.title}</h1>
          {doc.description && (
            <p className={styles.description}>{doc.description}</p>
          )}
        </header>
        <div className={styles.content}>
          <RenderMdx source={doc.content} />
        </div>
        <PrevNext prev={prev} next={next} />
      </article>
      <Toc />
    </div>
  );
}
