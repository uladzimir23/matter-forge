---
title: ADR-001 Extracted from library
date: 2026-04-21
status: accepted
---

# ADR-001 Вынести matter-forge из library/

## Контекст

До 2026-04-21 проект жил как `:3002` инстанс внутри `~/Documents/library/` —
общей папки с экспериментальными проектами, включая `builder-v2`,
`docs-app`, `DOCUMENTATION`, `FolderStructure` и ряд других. Это создавало
несколько проблем:

- **Каша с портами** и зависимостями: Vite, Next.js, Express крутились
  параллельно и мешали друг другу.
- **Нет отдельного git** — история изменений матерфорж-шоукейса была
  перемешана с историей прочих экспериментов.
- **Нет деплоя** — matter-forge жил только локально, нельзя было дать
  ссылку или показать клиенту.
- **Не мог быть референсом для других проектов** — каждый раз приходилось
  открывать `library/` и искать «что-то похожее».

## Решение

Вынести matter-forge в отдельный репо `uladzimir23/matter-forge`:

1. `rsync` из `library/` с исключением `.git`, `node_modules`, `dist`,
   `builder-v2`, `DOCUMENTATION`, `FolderStructure`.
2. Новый git-репо с чистой историей от 2026-04-21.
3. GH Pages деплой через Actions (см. [[ADR-005 GH Pages via Actions]]).
4. `library/` **не трогаем** — остаётся как есть.

## Последствия

- **+** Чистый репо, свой деплой, своя дорожная карта.
- **+** Можно давать публичную ссылку (`https://uladzimir23.github.io/matter-forge/`).
- **+** Другие проекты могут ссылаться на конкретный компонент в репо.
- **–** Дубликат в двух местах (`library/` и `matterforge-showcase/`) —
  но `library/` замороженный, дрейф невозможен.

## Связанные

- [[ADR-002 Category taxonomy]]
- [[ADR-003 Code-split modes]]
- [[ADR-004 Tailwind stays on CDN]]
- [[ADR-005 GH Pages via Actions]]
