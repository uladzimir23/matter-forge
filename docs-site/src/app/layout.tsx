import type { Metadata, Viewport } from 'next';
import { getNavTree } from '@/shared/lib/docs';
import { ThemeScript } from '@/shared/ui/theme-script/ThemeScript';
import { Topbar } from '@/widgets/topbar/Topbar';
import { Sidebar } from '@/widgets/sidebar/Sidebar';
import { MobileNav } from '@/widgets/mobile-nav/MobileNav';
import { DocsSearchProvider } from '@/widgets/search-dialog/DocsSearchProvider';
import './globals.scss';
import styles from './layout.module.scss';

export const metadata: Metadata = {
  title: {
    default: 'Matter Forge · docs',
    template: '%s · Matter Forge docs',
  },
  description: 'Словарь интерфейсных метафор: 215 React-компонентов в 16 категориях.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0d0f' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = await getNavTree();

  return (
    <html lang="ru" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        <DocsSearchProvider>
          <Topbar />
          <div className={styles.shell}>
            <Sidebar nav={nav} />
            <main className={styles.main}>{children}</main>
          </div>
          <MobileNav nav={nav} />
        </DocsSearchProvider>
      </body>
    </html>
  );
}
