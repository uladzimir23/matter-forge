---
title: Branching model
date: 2026-04-21
---

# Branching model

Персональный репо, один потребитель (я), один деплой — одна ветка-источник.

## Ветки

- **`main`** — всегда зелёная, GH Pages деплоится отсюда.
- **`feat/<scope>`** / **`fix/<scope>`** / **`docs/<scope>`** /
  **`chore/<scope>`** / **`refactor/<scope>`** — короткоживущие, 1–3 дня,
  squash-merge в `main`.

Нет `dev`, нет `staging`. Нет `gh-pages` отдельной ветки — Actions
деплоят напрямую.

## Когда PR, когда прямой push

**PR если:**
- Diff > 500 строк
- Хочется self-review
- Работа между устройствами и нужен preview

**Прямой push в `main` если:**
- Мелкое изменение
- Коммит один, атомарный, build проходит

## Conventional commits

Формат:

```
<type>(<scope>): <short>

[body, optional]
```

**Типы:**
- `feat` — новый компонент / новая фича
- `fix` — багфикс
- `docs` — volt, README, CLAUDE.md
- `chore` — версии, конфиги
- `refactor` — реорганизация без изменения поведения
- `style` — форматирование
- `build` — Vite/Tailwind конфиг
- `ci` — Actions/Netlify

**Scope:**
- Категория компонентов: `optical`, `kinetic`, `bio`, `system`...
- Слой: `docs`, `vault`, `docs-site`, `build`, `ci`, `skills`, `agents`

Примеры:
```
feat(optical): add SpectralWarp with chromatic dispersion
fix(kinetic): cleanup raf loop in InertialMomentumSlab
docs(catalog): add ChromaCore entry
docs(pattern): add Refraction Layer essay
docs(reuse): log ChromaCore → moreminsk
docs(adr): ADR-006 docs-site on Netlify
chore(build): bump vite to 6.2
refactor(components): split system/ into subfolders
```

## Когда коммит обязательно несёт несколько файлов

- **Новый компонент** — `.tsx` + catalog-entry `.mdx` в одном коммите
- **Переименование** — `git mv` + rewrite импортов в одном коммите
- **Перенос** — если в исходниках matter-forge ничего не менялось, reuse-entry
  идёт отдельным коммитом `docs(reuse): ...`

## Что запрещено

- `git push --force` в `main`
- `--no-verify` (pre-commit hook проверяет секреты)
- Коммиты, ломающие билд на `main`
- Секреты в коде/доках (pre-commit блокирует)

## Теги

Создаются только для знаковых состояний:
- `v0-library-extract` — экстракция из library ([[40 - Architecture/42 - ADR/ADR-001 Extracted from library]])
- `v0-categorized` — 215 компонентов в 16 папок ([[40 - Architecture/42 - ADR/ADR-002 Category taxonomy]])
- `v0-vault-online` — vault + docs-site задеплоены
