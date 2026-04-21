---
component: ComponentName
source: src/components/<cat>/ComponentName.tsx
target_project: moreminsk
target_file: src/widgets/<path>.tsx
target_commit: "xxxxxxx"
date: 2026-MM-DD
adaptation: trivial | moderate | heavy
kind: lift | inspiration
---

# ComponentName → project

## Зачем взяли

_1–2 предложения. В какой задаче целевого проекта пригодился._

## Что изменилось при переносе

- _Tailwind → SCSS Modules_
- _`LanguageContext` → `next-intl`_
- _font-tech → Manrope_
- _canvas loop обёрнут в useEffect cleanup_
- _props: `X` добавлен / `Y` убран / `Z` переименован_
- _анимация: упрощена / ускорена до 300ms_

## Что сломалось и как починили

_Самая ценная часть. Если всё завелось с первой попытки — так и пишем.
Если было «на canvas не рисовался контент в iOS Safari, потому что
canvas size был 0 при первом рендере» — описываем._

## Что стоит перенести обратно в matter-forge

_Если в адаптации появилось улучшение, которое имеет смысл вернуть в
оригинал — фиксируем как backlog-пункт:_

- _ref на improvement_

_Или «ничего — адаптации проекто-специфичные»._

## Линк на diff

- _PR: https://github.com/.../pull/NN_
- _Commit: xxxxxxx_
