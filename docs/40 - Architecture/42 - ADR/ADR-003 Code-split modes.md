---
title: ADR-003 Code-split по трём режимам через React.lazy
date: 2026-04-21
status: accepted
---

# ADR-003 Code-split через React.lazy

## Контекст

Initial bundle до split'а был ~1.15 MB (один `index.js`). Пользователь
открывает `/` (showcase) и грузит код builder'а и sandbox'а, хотя они
активируются по hash'у `#builder` и `#sandbox`.

## Решение

`React.lazy` + `Suspense` на уровне трёх режимов в `main.tsx`:

```tsx
const WoodenRecordApp = lazy(() => import('./wooden/App'));
const BuilderApp = lazy(() => import('./builder/App'));
const SandboxApp = lazy(() => import('./sandbox/App'));

<Suspense fallback={<ModeFallback />}>
  {view === 'SHOWCASE' ? <WoodenRecordApp />
   : view === 'BUILDER' ? <BuilderApp />
   : <SandboxApp />}
</Suspense>
```

## Результат

| Chunk | Размер |
|-------|--------|
| `index` (entry + router) | 224 KB |
| `vendor` (react, framer, lucide) | 271 KB |
| `App` wooden (lazy) | 568 KB |
| `App` builder (lazy) | 60 KB |
| `App` sandbox (lazy) | 23 KB |

**Initial load (showcase)** — ~495 KB вместо 1153 KB. Builder и sandbox
больше не попадают в первый запрос.

## Отвергнутые альтернативы

- **Manual chunks через `rollupOptions.output.manualChunks`** — работает,
  но требует ручного поддержания списка. `React.lazy` самопровозглашает
  границу.
- **Route-based split в `react-router`** — route'ы не используются (hash-based),
  нет смысла вводить router для одной цели.

## Backlog

- Дальнейший split внутри `wooden/App` (568 KB) — если будет проседать
  на мобильных. Кандидат — вынести heavy canvas-компоненты из showcase
  в отдельный chunk.
- Split по категориям `components/<cat>/` — если ревизия покажет, что
  один chunk тянет весь каталог.

## Последствия

- **+** Быстрее first paint на главной.
- **+** Каждый режим грузится независимо.
- **–** При переходе между режимами видна `<ModeFallback />` в ~200мс
  при первом открытии. Приемлемо для шоукейса.

## Связанные

- [[ADR-001 Extracted from library]]
- `src/main.tsx`
