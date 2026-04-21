import type { MDXComponents } from 'mdx/types';
import { Callout } from '@/shared/ui/callout/Callout';
import { Tag } from '@/shared/ui/tag/Tag';
import { Redacted } from '@/shared/ui/redacted/Redacted';
import { Expandable } from '@/shared/ui/expandable/Expandable';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Callout,
    Tag,
    Redacted,
    Expandable,
  };
}
