---
name: catalog-entry
description: How to write a component page in docs/30 - Catalog/<category>/. Trigger when creating or updating catalog-entry MDX files for matter-forge components.
---

# Catalog Entry

One MDX file per component in `docs/30 - Catalog/<category>/<ComponentName>.mdx`.
This is the **primary documentation surface** — it's what you read 6 months
later trying to remember whether this component fits your current task.

## Purpose

A catalog entry must answer three questions, in this order:

1. **Visual idea** — what does this look like, what does it evoke?
2. **Mechanics** — how is it built (canvas/SVG/CSS-only, which React hooks,
   what external deps)?
3. **Liftability** — what will break when you copy this into another project?

Don't document *what props it takes* line-by-line — the source is one click
away. Document what the source doesn't tell you.

## Template

Use `docs/80 - Templates/component-entry.mdx` as the starting point. Every
entry has the same frontmatter schema:

```yaml
---
title: ComponentName
category: bio | fluid | optical | quantum | gravity | thermal | neural |
  kinetic | atmospheric | acoustic | volumetric | structural | topology |
  state | molecular | system
tags: [refraction, haptic, canvas, webgl, svg, css-only, …]
patterns: [Refraction Layer, Haptic Language, …]  # links to 50 - Patterns & Motifs/
source: src/components/<cat>/<Name>.tsx
modes: [wooden, builder, sandbox]                  # where it's actually used
deps: [framer-motion, canvas, LanguageContext]     # what must exist in target project
complexity: trivial | moderate | heavy             # how hard to lift
status: stable | experimental | deprecated
date: 2026-04-21
---
```

## Sections (in order)

1. **Идея** — 2–5 предложений. Что это за эффект, откуда метафора, что оно
   передаёт визуально. Без скриншотов здесь — они в конце.
2. **Механика** — как реализовано. Canvas loop? Requestanimframe? CSS-only
   с `@keyframes`? WebGL шейдер? SVG filter? Какие React-хуки, какой state,
   есть ли внешние либы.
3. **Зависимости для переноса** — что обязательно должно быть в целевом
   проекте, чтобы оно заработало: `LanguageContext`, специфические Tailwind
   классы, шрифт font-tech, Framer Motion, lucide иконки, canvas-поддержка,
   ENV-переменная, etc. Каждый пункт — одна строка.
4. **Что адаптировать при lift'е** — честно: «этот контекст использует
   translations напрямую, в целевом проекте надо пробросить заглушку»,
   «анимация трясёт layout, нужен `will-change: transform`», «работает
   только в dark mode без доработки».
5. **Где уже используется** — ссылки на записи из `60 - Reuse Log/` если
   компонент уже куда-то перенесён.
6. **Связанные паттерны** — линки в `50 - Patterns & Motifs/`.
7. **Скриншоты/gif** — опционально, из `95 - Attachments/`.

## Naming

- Файл называется как `.tsx` без расширения: `ChromaCore.mdx`.
- `title` во frontmatter — тоже PascalCase без пробелов.
- Если компонент переименован в коде — **переименовать** MDX и обновить
  ссылки в Reuse Log / Patterns.

## Tags — controlled vocabulary

Теги берутся из **фиксированного словаря** `docs/20 - Design Language/Metaphor Dictionary.md`.
Новый тег — только если он попадает в словарь. Не плодим `shiny`, `cool`,
`fancy` — это шум.

Обязательные технические теги: что-то одно из `canvas`, `svg`, `webgl`,
`css-only`, `dom-anim`.

## Когда НЕ писать catalog-entry

- Если компонент — одноразовая склейка для одной секции `wooden/App.tsx`
  и никогда не будет вынесен — не пиши, пусть лежит в `wooden/components/`
  без catalog-entry.
- Если компонент deprecated — **не удаляй запись**, поставь
  `status: deprecated` и добавь секцию «Чем заменено».

## Проверка перед commit

- [ ] frontmatter заполнен полностью, все обязательные поля есть
- [ ] `source:` ссылается на существующий файл
- [ ] `category:` из 16 разрешённых (см. `category-triage` скилл)
- [ ] теги только из словаря
- [ ] ссылки на паттерны работают
- [ ] секция «Зависимости» заполнена честно — ты действительно знаешь что
      понадобится в целевом проекте
