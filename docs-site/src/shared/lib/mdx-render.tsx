import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Callout } from '@/shared/ui/callout/Callout';
import { Tag } from '@/shared/ui/tag/Tag';
import { Redacted } from '@/shared/ui/redacted/Redacted';
import { Expandable } from '@/shared/ui/expandable/Expandable';

const components = { Callout, Tag, Redacted, Expandable };

export function RenderMdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          format: 'md',
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          ],
        },
      }}
    />
  );
}
