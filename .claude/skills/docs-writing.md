---
name: docs-writing
description: Style guide for writing in the matter-forge Obsidian vault. Trigger whenever editing any .md or .mdx file in docs/.
---

# Docs Writing — matter-forge

## Общие правила

- **Язык** — русский в прозе, английский в именах компонентов, тегов и кода.
- **Лица** — первое лицо («я сделал») или безличное («сделано»), по вкусу,
  но в рамках одного файла единообразно.
- **Короткие абзацы.** 2–4 предложения. Если абзац длиннее — делим.
- **Списки.** Короткие bullet-листы читаются лучше сплошного текста.
- **Без воды.** «В этом разделе мы рассмотрим…» — удалять. Сразу к делу.
- **Конкретика важнее общих слов.** `backdrop-filter: blur(20px)` лучше
  чем «эффект размытия».

## Frontmatter

Всё что в `docs/` — с frontmatter. Минимум:
```yaml
---
title: <заголовок>
date: 2026-04-21
---
```

Специфический frontmatter:
- Catalog-entry — см. скилл `catalog-entry`
- Reuse-entry — см. скилл `reuse-entry`
- Pattern-essay — см. скилл `pattern-essay`
- ADR — см. шаблон в `80 - Templates/adr.md`
- Session log — см. скилл `session-log`

## Вики-ссылки vs пути

В рамках волта — **вики-ссылки** в квадратных скобках:
```markdown
см. [[30 - Catalog/optical/ChromaCore]] и [[50 - Patterns & Motifs/Refraction Layer]]
```

На файлы в `src/` — **относительные пути**:
```markdown
реализован в `src/components/optical/ChromaCore.tsx`
```

На файлы между проектами — **абсолютные пути от `~`**:
```markdown
скопирован в `~/Documents/moreminsk/src/widgets/hero/ui/HeroBackground.tsx`
```

## Заголовки

- H1 (`#`) — один на файл, совпадает с `title` во frontmatter (в MDX можно
  не дублировать — сайт отрисует из title).
- H2 (`##`) — основные секции.
- H3 (`###`) — подсекции, редко H4.
- H5–H6 не используем.

## Код-блоки

- Всегда указывать язык: ` ```ts`, ` ```tsx`, ` ```css`, ` ```bash`.
- Короткие сниппеты (до 20 строк) — в catalog-entry и pattern-essay
  допустимы.
- Длинные копии файлов — **нет.** Даём ссылку на источник.

## Таблицы

Таблицы полезны для:
- frontmatter-обзоров (категории × свойства)
- сравнений (режимы wooden/builder/sandbox)
- stack lists

Не злоупотреблять — длинный список в таблице читается хуже, чем bullet-list.

## Стиль ссылок в тексте

- На внутренний документ: вики-ссылка `[[40 - Architecture/42 - ADR/ADR-001]]`.
- На внешний ресурс: `[текст](https://example.com)`.
- На коммит: `[abc1234](https://github.com/uladzimir23/matter-forge/commit/abc1234)`
  если ссылка нужна; иначе просто `abc1234` в коде.

## Имена файлов

- Catalog-entry: `<ComponentName>.mdx` (PascalCase, совпадает с `.tsx`).
- ADR: `ADR-NNN <Kebab Title>.md` — `ADR-001 Extracted from library.md`.
- Pattern essay: `<Pattern Name>.md` — `Refraction Layer.md`.
- Reuse-entry: `YYYY-MM-DD <Component> → <project>.md`.
- Session log: `YYYY-MM-DD HH:mm <topic>.md`.

## Skip ADR когда…

Не каждое изменение требует ADR. ADR — только для **решений, которые
будут критиковать future-you через полгода**: выбор стека, смена структуры,
разделение ответственностей.

«Переименовал компонент» — не ADR, это session log.
«Поменял Tailwind на SCSS для целого проекта» — ADR.

## Правки старых документов

- В catalog-entry — свободно редактируем.
- В ADR — **не переписывать принятое решение.** Если решение пересмотрено,
  создаётся новый ADR со статусом «Supersedes ADR-NNN», старый получает
  в frontmatter `status: superseded, superseded_by: ADR-MMM`.
- Session logs — историческая запись, не редактируем постфактум. Опечатки
  можно. Содержательные правки — нет.
- Reuse-entries — можно дополнять секцию «Что стоит перенести обратно» по
  мере новых инсайтов.

## Redaction

См. CLAUDE.md раздел «Redaction policy». В публичных документах ключи,
токены, приватные хосты, чужие email — заменяются на `████` (U+2588).
