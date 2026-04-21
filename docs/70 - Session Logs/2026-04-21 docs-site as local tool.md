---
date: 2026-04-21
topic: docs-site as local tool
duration: 10m
outcomes:
  - adr_006_accepted
  - netlify_config_removed
  - backlog_and_claudemd_updated
related_adr: [ADR-006]
related_components: []
related_reuse: []
---

# 2026-04-21 — docs-site as local tool

## Контекст

Ранее сегодня в рамках поднятия vault-пайплайна ([[70 - Session Logs/2026-04-21 Vault + docs-site pipeline]])
записал в backlog пункт «задеплоить docs-site на Netlify». Сейчас —
передумал. Volt читаю только я, деплой оверкилл.

## Решение

`docs-site/` — локальная тула, без деплоя. Подробности → [[40 - Architecture/42 - ADR/ADR-006 docs-site is local-only]].

## Что сделано

- Удалён `docs-site/netlify.toml`.
- ADR-006 создан с полным обоснованием (5 аргументов).
- Backlog очищен от пункта «docs-site деплой».
- CLAUDE.md — секция `docs-site/` переписана на «локальная тула, не
  деплоится», добавлены команды запуска.

## Следующие шаги

- [ ] Добавить в zsh alias типа `alias mfd='cd ~/Documents/matterforge-showcase/docs-site && npm run dev'`
      — чтобы быстро открывать volt (опционально, если буду часто
      использовать)
- [ ] Продолжить с первыми catalog-entries и pattern-essay (как было в
      предыдущем session log)

## Артефакты

- ADR-006
- Коммит: _добавится при коммите_
