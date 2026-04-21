// Inline script to set theme BEFORE first paint — prevents flash.
export function ThemeScript() {
  const code = `
    try {
      var k = 'matter-forge-theme';
      var saved = localStorage.getItem(k) || 'system';
      var root = document.documentElement;
      if (saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.classList.add('dark');
      }
      if (saved !== 'system') root.setAttribute('data-theme', saved);
    } catch (e) {}
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
