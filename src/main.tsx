import React, { useState, useEffect, createContext, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Hammer, Layers, Atom, Loader2 } from 'lucide-react';
import { translations } from './translations';

const WoodenRecordApp = lazy(() => import('./wooden/App'));
const BuilderApp = lazy(() => import('./builder/App'));
const SandboxApp = lazy(() => import('./sandbox/App'));

type Language = 'en' | 'ru';
type Theme = 'dark' | 'light';
type TranslationType = typeof translations['en'];

export const LanguageContext = createContext<{
  lang: Language;
  t: TranslationType;
  setLang: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  isDiagnostic: boolean;
  setIsDiagnostic: (v: boolean) => void;
}>({
  lang: 'ru',
  t: translations.ru,
  setLang: () => {},
  theme: 'dark',
  setTheme: () => {},
  isDiagnostic: true,
  setIsDiagnostic: () => {},
});

const ModeFallback: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xl">
    <div className="flex items-center gap-3 text-zinc-400 font-tech tracking-widest text-xs uppercase">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>Initializing spatial field…</span>
    </div>
  </div>
);

const RootComponent: React.FC = () => {
  const [view, setView] = useState<'SHOWCASE' | 'BUILDER' | 'SANDBOX'>('SHOWCASE');
  const [lang, setLang] = useState<Language>('ru');
  const [theme, setTheme] = useState<Theme>('dark');
  const [isDiagnostic, setIsDiagnostic] = useState(true);

  const t = translations[lang] as TranslationType;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#builder') setView('BUILDER');
      else if (hash === '#sandbox') setView('SANDBOX');
      else setView('SHOWCASE');
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t, setLang, theme, setTheme, isDiagnostic, setIsDiagnostic }}>
      <Suspense fallback={<ModeFallback />}>
        {view === 'SHOWCASE' ? <WoodenRecordApp /> : view === 'BUILDER' ? <BuilderApp /> : <SandboxApp />}
      </Suspense>

      <div className="fixed bottom-10 right-10 z-[9999] flex flex-col gap-4">
         <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 flex flex-col gap-2 shadow-2xl">
            <button
              onClick={() => window.location.hash = ''}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${view === 'SHOWCASE' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:bg-white/5'}`}
            >
               <Layers className="w-6 h-6" />
            </button>
            <button
              onClick={() => window.location.hash = '#builder'}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${view === 'BUILDER' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-zinc-500 hover:bg-white/5'}`}
            >
               <Hammer className="w-6 h-6" />
            </button>
            <button
              onClick={() => window.location.hash = '#sandbox'}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${view === 'SANDBOX' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-zinc-500 hover:bg-white/5'}`}
            >
               <Atom className="w-6 h-6" />
            </button>
         </div>
      </div>
    </LanguageContext.Provider>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");
const root = ReactDOM.createRoot(rootElement);
root.render(<React.StrictMode><RootComponent /></React.StrictMode>);
