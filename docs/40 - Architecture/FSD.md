---
title: FSD Layout
date: 2026-04-21
---

# FSD Layout в matter-forge

Вариант **FSD-lite**, адаптированный под шоукейс с тремя режимами.
Классическая FSD (app → pages → widgets → features → entities → shared)
не ложится — у нас нет страниц-в-роутере и нет бэкенд-сущностей. Вместо
этого — **три режима** + **общие примитивы**.

## Дерево

```
src/
├── main.tsx              # entry + hash-router + 3 Suspense lazy-mode
├── App.tsx               # landing-компонент MatterForge (вкладывается в wooden/App)
├── index.css             # global (Tailwind entry через @tailwindcss/vite)
├── translations.ts       # i18n ru/en — общий контекст
├── constants.tsx         # общие константы (цвета лейблов и т.п.)
├── types.ts              # общие типы
│
├── components/           # 215 общих примитивов (cross-mode)
│   ├── bio/              # 21
│   ├── fluid/            # 14
│   ├── optical/          # 24
│   ├── quantum/          # 9
│   ├── gravity/          # 7
│   ├── thermal/          # 6
│   ├── neural/           # 20
│   ├── kinetic/          # 24
│   ├── atmospheric/      # 5
│   ├── acoustic/         # 11
│   ├── volumetric/       # 11
│   ├── structural/       # 8
│   ├── topology/         # 7
│   ├── state/            # 8
│   ├── molecular/        # 10
│   └── system/           # 30
│
├── wooden/               # режим Showcase — основной шоурум
│   ├── App.tsx
│   ├── components/       # локальные секции и виджеты шоурума
│   └── ...
│
├── builder/              # режим Builder — визуальный конструктор
│   ├── App.tsx
│   └── components/
│
├── sandbox/              # режим Sandbox — песочница атомарных примитивов
│   ├── App.tsx
│   └── components/
│
└── services/             # внешние сервисы
    └── geminiService.ts  # Gemini API, только builder
```

## Правила импорта

**Сверху вниз, никогда обратно:**

```
wooden/ ┐
builder/├── может импортировать → components/, services/, translations, constants, types
sandbox/┘

components/<cat>/ ── может импортировать → translations, constants, types, другие components/<cat2>/
                 ── НЕ может импортировать → wooden/, builder/, sandbox/

services/ ── может импортировать → types
         ── НЕ может импортировать → wooden/, builder/, sandbox/, components/
```

**Между категориями в `components/`** — импорты разрешены, но нежелательны.
Если `optical/ChromaCore` импортирует `bio/MembraneGenesis` — возможно один
из двух не в той категории. Проверить через [[.claude/skills/category-triage]].

## Cross-mode rule

Компонент переезжает из `wooden/components/` в `src/components/<cat>/`
когда **второй режим** начинает его использовать. Если третий режим
добавляет особое использование — это не триггер, компонент уже общий.

Обратный путь (из `components/` обратно в локальный) — редкий случай,
только если становится ясно, что компонент используется ровно одним
режимом и теряет смысл как общий.

## Hash-router

Минималистичный роутинг в `main.tsx`:

```tsx
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
```

Почему hash, а не `react-router`: три модуля — не страницы, а режимы.
История не нужна, закладки работают, GH Pages без SPA-fallback работает
сразу. См. ADR-005 про деплой.

## Code-split

`React.lazy` на уровне режимов (ADR-003):

```tsx
const WoodenRecordApp = lazy(() => import('./wooden/App'));
const BuilderApp = lazy(() => import('./builder/App'));
const SandboxApp = lazy(() => import('./sandbox/App'));
```

Это даёт 3 отдельных chunk'а (один на активный режим) + vendor + shared.
Внутри режимов дополнительный split пока не сделан — компоненты
`components/<cat>/` попадают в тот chunk, из которого впервые импортируются.

**Потенциальная оптимизация (backlog):** split по категориям в
`components/` если какой-то бандл станет слишком большим.

## Шаблон нового режима

Добавить четвёртый режим (например, `studio/`):
1. `src/studio/App.tsx` + компоненты в `src/studio/components/`
2. В `main.tsx`:
   - `const StudioApp = lazy(() => import('./studio/App'));`
   - Добавить handle в hash-роутер (`#studio` → `setView('STUDIO')`)
   - Добавить кнопку в floating HUD
3. Обновить `docs/40 - Architecture/FSD.md` (этот документ)
4. ADR про добавление режима

## Два LanguageContext — known issue

Сейчас **два `LanguageContext`** — один в `src/App.tsx`, второй в
`src/main.tsx`. Это дубль, оставшийся от экстракции. В backlog: слить.

Пока работает потому что оба контекста отдают совместимые значения из
`translations.ts`.
