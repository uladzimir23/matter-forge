import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllDocs, getDocBySlug } from '@/shared/lib/docs';
import { DocPage } from '@/widgets/doc-page/DocPage';

export const dynamicParams = false;

export async function generateStaticParams() {
  const docs = await getAllDocs();
  return docs
    .filter((d) => d.slug.length > 0)
    .map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
  };
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);
  if (!doc) return notFound();
  return <DocPage doc={doc} />;
}
