import { notFound } from 'next/navigation';
import { getDocBySlug } from '@/shared/lib/docs';
import { DocPage } from '@/widgets/doc-page/DocPage';

export default async function HomePage() {
  const doc = await getDocBySlug([]);
  if (!doc) return notFound();
  return <DocPage doc={doc} />;
}
