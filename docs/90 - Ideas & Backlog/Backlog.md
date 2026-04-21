---
title: Backlog
date: 2026-04-21
---

# Backlog

Живой список идей и отложенных работ. Пополняется по ходу.

## Инфраструктура

- [ ] **Tailwind CDN → локальный билд.** См. [[40 - Architecture/42 - ADR/ADR-004 Tailwind stays on CDN]]. Триггеры миграции описаны там.
- [ ] **Слить два `LanguageContext`** — сейчас дубль в `src/App.tsx` и `src/main.tsx`. Не критично, работает.
- [ ] **Pre-commit hook на секреты.** Скрипт `scripts/check-secrets.sh`
  написан, но не привязан к git-hooks. Добавить когда (если) появится Gemini
  API ключ.
- [ ] **Собственный домен.** Если появится — CNAME + убрать `base: '/matter-forge/'`
  в vite.config.

## Шоукейс — фичи

- [ ] **Страница каталога** в самом шоукейсе с фильтром по тегам
  словаря — читает JSON-индекс, собранный на билде из catalog-entries.
- [ ] **Dev HUD — счётчик FPS** для heavy canvas-компонентов.
- [ ] **Deep-link на конкретный компонент** в sandbox (`#sandbox/ChromaCore`).

## Vault — контент

- [ ] Первое pattern-essay — **Refraction Layer** (ChromaCore,
  ChromaticDispersion, RefractiveHUD, PrismaticFlux, SpectralWarp).
- [ ] Catalog-entries для топ-10 «демонстрационных» компонентов шоурума
  (те, что на главной в wooden-режиме).
- [ ] **Глоссарий семей** в 20 Design Language — отдельный файл
  «Откуда семья имён» с источниками из физики/биологии.
- [ ] Attachments: собрать скриншоты ключевых компонентов в `95 - Attachments/`
  и прописать ссылки в нескольких catalog-entries.

## Категории — ревизия

- [ ] **`system/` разрастается.** Уже 30 компонентов, самая большая
  папка. Если дойдёт до 40 — разделить на под-категории (tools / shell /
  meta) — см. митигацию в ADR-002.
- [ ] **Пересмотреть `state/`** — граница с `kinetic/` и `topology/`
  нечёткая. StateMorpher vs TopologicalMorph — в чём разница?

## Словарь

- [ ] Добавить семью для **«молекулярных» слов** в Dictionary — сейчас
  `state/molecular/system` менее строго определены.
- [ ] Формализовать связь `resonance` в acoustic vs в neural — может,
  ввести `acoustic-resonance` и `neural-resonance` как два разных тега.

## Идеи — новые модули шоукейса

- [ ] **`studio/` режим** — инспектор/редактор компонентов с live-props.
- [ ] **`archive/` режим** — storage для deprecated компонентов с меткой.

## Process

- [ ] Попробовать использовать `docs-sync` после первых значимых
  изменений и посмотреть насколько хорошо он держит индексы.
- [ ] Если memory-папка начнёт разрастаться — почистить через кадр конверсации.
