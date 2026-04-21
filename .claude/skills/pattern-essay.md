---
name: pattern-essay
description: How to write a Patterns & Motifs essay in docs/50 - Patterns & Motifs/. Trigger when identifying a technique that recurs across 3+ components and deserves a meta-explanation.
---

# Pattern & Motif Essay

**Эссе про сквозную технику, которая повторяется в ≥3 компонентах.**
Catalog-entry отвечает «что это за компонент». Pattern essay отвечает «как
устроен этот визуальный язык идейно».

## Триггер создания

Замечаешь, что несколько компонентов используют одну и ту же технику или
метафору:
- `ChromaCore`, `ChromaticDispersion`, `RefractiveHUD`, `PrismaticFlux`,
  `SpectralWarp` — все работают с преломлением через CSS-фильтры и
  `backdrop-filter: hue-rotate`
- `KineticMomentumDecay`, `InertialMomentumSlab`, `ElasticScrollOverdrive` —
  всё это pattern «kinetic decay»: инерция + затухание по экспоненте

Это не совпадение — это паттерн. Напиши эссе.

## Когда **не** писать

- Если техника использована только в 1–2 компонентах — рано, ждём до трёх.
- Если «паттерн» — это просто то что `React.memo` используется. Это не
  паттерн, это оптимизация.
- Если не можешь сформулировать идею одним предложением — рано.

## Файл

`docs/50 - Patterns & Motifs/<Pattern Name>.md`

Название — PascalCase с пробелами: `Refraction Layer.md`, `Kinetic Decay.md`,
`Glass Morphism.md`, `Spectral Warp.md`.

## Frontmatter

```yaml
---
title: Refraction Layer
components: [ChromaCore, ChromaticDispersion, RefractiveHUD, PrismaticFlux, SpectralWarp]
categories: [optical]                 # где паттерн встречается
complexity: moderate
date: 2026-04-21
---
```

## Структура эссе (1–3 страницы)

### 1. Идея (1–2 абзаца)

Что за метафора, откуда она взята, что она даёт пользователю. Без кода.

Пример: *«Refraction Layer — слой преломления поверх основного контента,
имитирующий прохождение света через оптическую среду. Берётся из
кинематографии: прозрачные объекты в кадре (стекло, вода, линза) создают
локальное искажение. Даёт ощущение, что UI сделан из физического материала,
а не нарисован плоско.»*

### 2. Как это устроено технически (2–4 абзаца)

**Без кода в объёме полного компонента.** Только ключевые приёмы:
- какие CSS properties / SVG filters / canvas операции
- порядок слоёв (что под чем)
- какие трюки с `backdrop-filter`, `mix-blend-mode`, `filter: url(#...)`
- что критично для performance (layer composition, `will-change`,
  `transform: translateZ(0)` для promote)

Можно вставить короткие сниппеты (5–15 строк) для иллюстрации ключевой
идеи. Но не копипасту целого компонента — этого много в Catalog.

### 3. Реализации в шоукейсе (список)

Ссылки на все компоненты из frontmatter `components:` с коротким
комментарием: как именно в этом компоненте применён паттерн, в чём
специфика данной реализации.

```markdown
- [[30 - Catalog/optical/ChromaCore]] — минимальная реализация через
  `backdrop-filter: hue-rotate(45deg) saturate(1.5)`, без canvas
- [[30 - Catalog/optical/ChromaticDispersion]] — добавляет RGB-split
  через 3 clones с `mix-blend-mode: screen`
- [[30 - Catalog/optical/RefractiveHUD]] — комбинирует с SVG `feDisplacementMap`
  для органических искажений
```

### 4. Когда использовать / когда не использовать

Честные границы паттерна:
- **Хорошо** для hero-секций, модалок, фокусных элементов
- **Плохо** для длинных списков (performance), для мобайл (backdrop-filter
  дорог), для a11y-критичных контролов
- **Альтернативы** — если не подходит, что взять вместо

### 5. Внешние источники вдохновения

Ссылки на оригиналы: сайты, дизайнеры, видео, кейсы — откуда идея вообще
пришла. Apple iOS? Awwwards? Конкретный студийный сайт? Shader toy?

## После публикации эссе

1. В каждом catalog-entry из `components:` добавить в frontmatter
   `patterns: [<Pattern Name>]` и ссылку в секции «Связанные паттерны».
2. Вызвать `docs-sync` — он обновит Dashboard/Tags/Map.

## Anti-pattern

- Эссе ради эссе: если нет трёх реализаций, это не паттерн, это компонент.
- Копипаста catalog-entry: эссе выше уровнем — не про конкретный компонент,
  а про идею.
- «Магическая инструкция по созданию»: не надо писать эссе как tutorial.
  Это описание, не гайд.
