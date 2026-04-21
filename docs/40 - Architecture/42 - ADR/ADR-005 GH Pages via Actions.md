---
title: ADR-005 Деплой matter-forge на GH Pages через Actions
date: 2026-04-21
status: accepted
---

# ADR-005 GH Pages via Actions

## Контекст

После экстракции ([[ADR-001 Extracted from library]]) нужен публичный
URL — чтобы давать клиентам, чтобы ссылаться из других проектов, чтобы
проверять визуальные регрессии. Варианты хостинга:

- **GH Pages** — бесплатно, сразу доступно после создания репо, деплой
  через Actions
- **Netlify** — бесплатный tier, preview-билды на PR, удобный UI
- **Vercel** — оптимизирован под Next.js, для Vite overkill
- **CF Pages** — похож на Netlify

## Решение

**GH Pages через Actions.**

`.github/workflows/deploy.yml`:
- На push в `main`:
  - checkout → setup-node → `npm ci` → `npm run build` с
    `GITHUB_ACTIONS=true` (это переключает `vite.config.ts` на
    `base: '/matter-forge/'`) → upload-pages-artifact → deploy-pages
- Permissions: `pages: write, id-token: write`
- `concurrency: group: pages, cancel-in-progress: true`

Итог — URL `https://uladzimir23.github.io/matter-forge/`.

## Почему GH Pages, не Netlify

- matter-forge — персональный репо в моём GH. Pages включается в один
  клик, без дополнительного сервиса и токенов.
- Не нужны PR previews (работаю в `main`).
- Не нужен edge-функционал (статический Vite билд).

## Почему не subdomain (matter-forge.uladzimir.dev)

- Своего домена пока нет. Если появится — добавить `CNAME` файл в `public/`
  и настроить DNS, существующий workflow продолжит работать.

## vite.config.ts — base switch

```ts
base: process.env.GITHUB_ACTIONS ? '/matter-forge/' : '/',
```

Локально `npm run dev` и `npm run build` отдают `base: '/'`. CI — subpath.
Локально воспроизвести прод-билд: `GITHUB_ACTIONS=true npm run build`.

## Будущий shared случай: docs-site

`docs-site/` — **отдельный Next.js**, который будет деплоиться независимо.
Для него скорее всего **Netlify** (как у comforthotel), чтобы иметь
preview'ы при работе над контентом волта. См. backlog.

## Последствия

- **+** Деплой один клик, URL живёт.
- **+** Workflow простой, читаем.
- **–** subpath `/matter-forge/` — внешние ссылки на ассеты должны
  учитывать base. Пока работает, но если добавим иконки/шрифты через
  абсолютные пути — сломается.
- **–** При добавлении CNAME на custom-домен — надо будет убрать `base`.

## Связанные

- `.github/workflows/deploy.yml`
- `vite.config.ts`
- [[90 - Ideas & Backlog/Backlog]] — docs-site deploy decision
