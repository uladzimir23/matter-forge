---
title: How to add a component
date: 2026-04-21
---

# Как добавить новый компонент

Процедура строгая — чтобы шоукейс не превращался в кашу из случайных
файлов.

## 1. Триаж категории

Открыть [[.claude/skills/category-triage]], пройти дерево решений.
Результат — одна из 16 категорий: `bio`, `fluid`, `optical`, `quantum`,
`gravity`, `thermal`, `neural`, `kinetic`, `atmospheric`, `acoustic`,
`volumetric`, `structural`, `topology`, `state`, `molecular`, `system`.

Если компонент «подходит в две» — ключевая метафора (что он **изображает**)
определяет первичную категорию. Вторая идёт в теги.

## 2. Имя

Правила:
- **PascalCase**, без пробелов, без цифр кроме `3D`/`2D`
- Составлено из слов словаря метафор ([[20 - Design Language/Metaphor Dictionary]])
- Читается как фраза: `ChromaCore`, `RefractiveHUD`, `KineticMomentumDecay`
- Не кончается на -Component, -Widget, -UI, -Box, -Thing
- Не повторяет имя уже существующего файла

Проверить: `Glob("src/components/**/<Name>.tsx")` — должен быть пуст.

## 3. Файл .tsx

`src/components/<category>/<Name>.tsx`

Минимальный контракт:
- Экспорт по умолчанию или именованный — совместимо с тем, как его
  будут импортировать в режимы
- TypeScript типы на props
- Использование `LanguageContext` — опционально, если нужен текст
- Анимация — предпочтительно RAF-based (не `setInterval`)
- Cleanup — все raf/listeners/observers отменяются в `useEffect` return

## 4. Catalog entry

`docs/30 - Catalog/<category>/<Name>.mdx`

Взять шаблон [[80 - Templates/component-entry]], заполнить:
- frontmatter (title, category, tags, patterns, source, modes, deps, complexity, status, date)
- Идея (что изображает, 2–5 предложений)
- Механика (как сделано)
- Зависимости для переноса (`LanguageContext`, framer-motion, canvas, font-tech…)
- Что адаптировать при lift'е
- Где уже используется (пусто при создании)
- Связанные паттерны (ссылки в `50 - Patterns & Motifs/` если подходят)

## 5. Теги

3–7 тегов из словаря метафор + **обязательно** один технический тег
(`canvas`, `svg`, `webgl`, `css-only`, `dom-anim`, `mixed-rendering`).

Если нужного слова в словаре нет — **не добавлять на ходу**. Расширение
словаря — отдельная процедура (см. [[.claude/skills/design-vocabulary]]).

## 6. Регистрация в режиме

Компонент подключается хотя бы к одному из режимов:
- В `wooden/App.tsx` как часть showcase
- В `builder/App.tsx` как блок
- В `sandbox/App.tsx` как карточка

Если компонент пока не подключён — всё равно создаём catalog-entry, но в
frontmatter `modes: []` и `status: experimental`.

## 7. Session log

Если сессия добавила 1 компонент — упоминаем в session log. Если больше
пяти — отдельная запись про «расширение каталога в категории X».

## 8. Коммит

```
feat(<category>): add <Name> — <short idea>

- src/components/<category>/<Name>.tsx
- docs/30 - Catalog/<category>/<Name>.mdx
```

## 9. docs-sync

В конце (если сессия добавила несколько компонентов) — вызвать
`Agent({subagent_type: "docs-sync", prompt: "added components: X, Y"})`.
Обновятся счётчики в Dashboard, секции в Map, теги в Tags.

## Чеклист (до коммита)

- [ ] Категория выбрана через triage, не наугад
- [ ] Имя читается через словарь
- [ ] `.tsx` собирается, не ломает `npm run build`
- [ ] `.mdx` создан, frontmatter заполнен
- [ ] Теги — из словаря + 1 технический
- [ ] `modes:` заполнено (или `[]` + `experimental`)
- [ ] Cleanup анимаций есть
- [ ] Коммит с обоими файлами вместе
