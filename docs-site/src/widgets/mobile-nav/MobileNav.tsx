'use client';

import { BottomNav } from '@/widgets/bottom-nav/BottomNav';
import type { NavNode } from '@/shared/lib/docs';

export function MobileNav({ nav }: { nav: NavNode[] }) {
  return <BottomNav nav={nav} />;
}
