---
title: Dashboard
date: 2026-04-21
---

# Dashboard

**Статус (2026-04-21):** Vault только что поднят. Code-split + категоризация
215 компонентов — уже в проде. Catalog ещё не заполнен — записи создаются
по мере переноса компонентов в потребители.

**Активный ADR:** [[40 - Architecture/42 - ADR/ADR-005 GH Pages via Actions]]

## Счётчики

| Модуль | Шт |
|--------|----|
| Catalog entries | 0 / 215 |
| Patterns & Motifs | 0 |
| ADR | 5 |
| Reuse Log | 0 |
| Session Logs | 1 |

Компоненты в `src/components/` физически разложены по 16 папкам, но
MDX-записи в Catalog пока не написаны — они создаются **по triggering
событию** (перенос в другой проект, важное переопределение, новое API).

## Категории в src/components/

| Категория | Файлов | Catalog записей |
|-----------|--------|-----------------|
| bio | 21 | 0 |
| fluid | 14 | 0 |
| optical | 24 | 0 |
| quantum | 9 | 0 |
| gravity | 7 | 0 |
| thermal | 6 | 0 |
| neural | 20 | 0 |
| kinetic | 24 | 0 |
| atmospheric | 5 | 0 |
| acoustic | 11 | 0 |
| volumetric | 11 | 0 |
| structural | 8 | 0 |
| topology | 7 | 0 |
| state | 8 | 0 |
| molecular | 10 | 0 |
| system | 30 | 0 |

## Последние сессии

- 2026-04-21 — [[70 - Session Logs/2026-04-21 Vault + docs-site pipeline]]

## Последние переносы

_пусто_

## Роадмап

**Сейчас:**
- [x] Экстракция из `library/`
- [x] Категоризация 215 компонентов (ADR-002)
- [x] Code-split режимов (ADR-003)
- [x] GH Pages деплой (ADR-005)
- [x] Vault + skills + agents pipeline

**Дальше:**
- [ ] Задеплоить docs-site (Netlify — решить после наполнения первыми записями)
- [ ] Написать первые 5–10 catalog-entries для самых ходовых компонентов
- [ ] Написать первое pattern-essay (вероятно `Refraction Layer`)
- [ ] Мигрировать Tailwind с CDN на локальный билд
- [ ] Слить дубль `LanguageContext` (src/App vs src/main)
- [ ] Страница каталога в самом шоукейсе с фильтром по тегам

## Потребители (где компоненты уже переносились)

_пусто_ — Reuse Log стартует вместе с первым переносом.
