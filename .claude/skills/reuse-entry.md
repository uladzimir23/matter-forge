---
name: reuse-entry
description: How to log a matter-forge component transfer to another project. Trigger when a component from src/components/ gets copied into moreminsk, comforthotel, neuro-center, wedding, or any other consumer project.
---

# Reuse Entry

**Это ядро референс-проекта.** Без reuse-entry компоненты копируются в
пустоту — через два месяца ты не помнишь, что адаптировал и почему. Reuse
Log — это память переноса.

## Когда создавать

**Обязательно**, как только компонент (или его часть) скопирован в другой
репо и что-то в нём изменилось. Если компонент ушёл 1:1 без правок — всё
равно создаём, с пометкой «Перенос 1:1».

Создаём **после** того, как в целевом проекте ты подтвердил что оно
работает — не предварительно.

## Файл

`docs/60 - Reuse Log/YYYY-MM-DD <ComponentName> → <project>.md`

Примеры:
- `2026-04-22 ChromaCore → moreminsk.md`
- `2026-04-22 RefractiveHUD → comforthotel.md`
- `2026-04-25 KineticBloomMenu+HapticGradients → wedding.md` (если
  связка двух)

## Template

Использовать `docs/80 - Templates/reuse-entry.md`. Frontmatter:

```yaml
---
component: ChromaCore                              # должен существовать в Catalog
source: src/components/optical/ChromaCore.tsx
target_project: moreminsk
target_file: src/widgets/hero/ui/HeroBackground.tsx
target_commit: "abc1234"                           # hash в целевом репо
date: 2026-04-22
adaptation: trivial | moderate | heavy             # сколько пришлось переделать
kind: lift | inspiration                           # копия кода vs идея
---
```

- `kind: lift` — кусок кода действительно скопирован
- `kind: inspiration` — переписан с нуля по мотивам, не копия

## Sections

1. **Зачем взяли** — 1–2 предложения. В какой задаче целевого проекта он
   пригодился.
2. **Что изменилось при переносе** — список по пунктам:
   - Tailwind → SCSS Modules (если целевой проект на SCSS)
   - `LanguageContext` убран / заменён на `next-intl`
   - font-tech заменён на Manrope
   - canvas loop завёрнут в `useEffect` с cleanup (если оригинал протекал)
   - props добавлены / убраны / переименованы
   - анимация упрощена / ускорена / убрана
3. **Что сломалось и как починили** — если что-то не работало сразу,
   записать симптом и фикс. Это самая ценная часть.
4. **Что стоит перенести обратно в matter-forge** — если в адаптации
   появилось улучшение, которое имеет смысл вернуть в первоисточник,
   записать это как backlog-пункт + ссылка на issue/PR.
5. **Линк на diff** — если возможно, ссылка на PR в целевом репо.

## Формат имени target_project

Ровно как имя папки в `~/Documents/`:
- `moreminsk`
- `comforthotel`
- `neuro-center`
- `wedding`
- `clariva-spa-landing`
- `fenix`
- `sync-brand-site-v2`

## После создания reuse-entry

1. В catalog-entry компонента в секции «Где уже используется» добавить
   линк: `- [[60 - Reuse Log/2026-04-22 ChromaCore → moreminsk]]`.
2. Если адаптация = heavy, то:
   - Завести запись в `90 - Ideas & Backlog/` — «переосмыслить API
     ChromaCore чтобы следующий lift был проще»
3. Вызвать `docs-sync` агента — он обновит Dashboard/Map.

## Anti-pattern

Нельзя писать «перенёс ChromaCore, всё ок». Если всё ок — пиши всё ок,
но **опиши что именно ты сделал**: какой файл, какой коммит, что проверил.
Reuse-entry без конкретики не нужен.
