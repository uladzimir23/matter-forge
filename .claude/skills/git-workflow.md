---
name: git-workflow
description: Git conventions for matter-forge — branches, commit messages, release flow. Trigger when committing, creating branches, or preparing a release.
---

# Git Workflow — matter-forge

Репо — персональный референс, не продукт с пользователями. Поэтому флоу
проще чем у коммерческих проектов.

## Ветки

- `main` — всегда зелёная, GH Pages деплоится отсюда.
- `feat/<scope>`, `fix/<scope>`, `docs/<scope>`, `chore/<scope>`,
  `refactor/<scope>` — короткоживущие (1–3 дня), squash-merge в `main`.
- Нет `dev`/`staging` — один source of truth, потому что нет
  пользователей-заказчиков.

## Коммит-сообщения

Conventional commits, всегда в нижнем регистре кроме имён файлов:

```
feat(optical): add SpectralWarp with chromatic dispersion
fix(kinetic): cleanup raf loop in InertialMomentumSlab
docs(catalog): add entry for ChromaCore
docs(pattern): add Refraction Layer essay
docs(reuse): log ChromaCore → moreminsk
docs(adr): ADR-005 GH Pages via Actions
chore(build): bump vite to 6.2
refactor(components): split system/ by purpose
```

**Scope** — либо категория компонентов (`optical`, `kinetic`, `bio`), либо
слой проекта (`docs`, `build`, `ci`, `docs-site`, `vault`).

## Что **обязательно** в одном коммите

- **Код + catalog-entry.** Если добавляешь компонент, commit включает и
  `.tsx`, и `.mdx` из `30 - Catalog/`. Не разнести на два коммита.
- **Переименование + rewrite импортов.** Никогда не коммитить только `git mv`
  без обновления импортов.
- **Reuse-entry + session log.** Если перенос оставляет след — оба в
  одном коммите.

## Что **запрещено**

- `git push --force` в `main` (даже на персональном репо — страховка от
  случайного `reset`).
- `--no-verify` — pre-commit hook `scripts/check-secrets.sh` обязателен.
- Коммиты с `API_KEY`, `token`, `secret` в diff, даже в `.md`. Только
  `████`.
- Коммиты, оставляющие проект не собирающимся. Билд обязан проходить в
  каждом коммите на `main`.

## Перед коммитом — чеклист

- [ ] `npm run build` проходит
- [ ] Если добавил/поменял компонент — есть catalog-entry
- [ ] Если изменил архитектуру — есть ADR
- [ ] Если сессия была значимой — session log
- [ ] `git status` не показывает случайных файлов
- [ ] `.env.local`, `.vault-private/` не в индексе

## Релизы

- **GH Pages** обновляется автоматически на каждый push в `main` через
  `.github/workflows/deploy.yml`.
- Версии не ставятся — нет потребителей-через-npm.
- Теги создаются только для знаковых состояний:
  - `v0-library-extract` — экстракция из library
  - `v0-categorized` — 215 компонентов в 16 папок
  - `v0-vault-online` — docs-site задеплоен
  - И дальше — по мере природных вех

## Работа с docs-site

`docs-site/` — отдельный подпроект. Деплой — отдельный (вероятно Netlify,
см. backlog).

- Изменения в `docs/` → деплой docs-site триггерится (когда будет
  настроен CI).
- Изменения в `docs-site/src/` → тот же деплой.
- Изменения в `src/` (сам шоукейс) → только GH Pages.

Netlify `ignore`-команда проверяет изменения в `docs/` и `docs-site/`
вместе, как в comforthotel:
```
git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF -- docs docs-site
```

## PR или прямой push?

Персональный репо — по умолчанию прямой push в `main` допустим. PR-ы
имеют смысл когда:
- Большая фича (>500 строк diff) и хочется self-review
- Идёт эксперимент, хочется видеть preview перед merge
- Работа идёт между устройствами и хочется ci-check

## Pre-commit hook

`scripts/check-secrets.sh` вызывается через git hook (или через lefthook
если будет установлен). Проверяет:
- `AIza[0-9A-Za-z\-_]{35}` (Google API keys, включая Gemini)
- `sk-[A-Za-z0-9]{32,}` (OpenAI-подобные)
- `ghp_[A-Za-z0-9]{36}` (GitHub PAT)
- `eyJ[A-Za-z0-9_\-]+\.eyJ` (JWT)

Реальные значения — только в `.env.local` (gitignored).
