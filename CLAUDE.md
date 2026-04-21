# matter-forge — Project context for Claude Code

Референс-шоукейс визуальных интерфейсов. **215 React-компонентов** в 16
тематических категориях. Это персональная библиотека идей и кода для других
проектов (moreminsk, comforthotel, wedding, neuro-center…). Задача шоукейса —
не «продукт», а **источник**: сюда приходишь найти эффект, понять как он
устроен, вынести в рабочий проект и записать перенос.

## Текущее состояние (2026-04-21)

- **Экстракция из `library/` завершена** — проект вынесен в отдельный репо
  `uladzimir23/matter-forge`, свой git с нуля, GitHub Pages деплой через
  Actions.
- **Категоризация 215 компонентов** — разложены по 16 папкам в
  `src/components/<cat>/` с полным rewrite импортов. См. `ADR-002`.
- **Code-split режимов** — wooden/builder/sandbox через `React.lazy`, initial
  bundle ~495 KB (было 1.1 MB). См. `ADR-003`.
- **Vault + docs-site** — добавлен Obsidian-волт в `docs/` (Johnny Decimal,
  12 модулей) и Next.js рендер-сайт `docs-site/`.

Живой шоукейс: <https://uladzimir23.github.io/matter-forge/>

## Видение

Matter-forge — не «библиотека компонентов» в смысле `@mui/material`. Это
**словарь интерфейсных метафор**: bio, fluid, optical, quantum, gravity,
thermal, neural, kinetic, atmospheric, acoustic, volumetric, structural,
topology, state, molecular, system. Каждый компонент — иллюстрация одной
идеи из этого словаря. Компоненты не унифицированы по API, не покрыты
тестами, не готовы к npm-пакету. Это нормально — они референс, не зависимость.

Когда приходит задача в другом проекте («нужен hero-эффект с преломлением»,
«нужен kinetic-переход на лендинге отеля»), путь такой:

1. Идёшь в `30 - Catalog/<category>/` или используешь `50 - Patterns & Motifs/`
2. Находишь подходящий компонент, читаешь его catalog-entry
3. Копируешь код в целевой проект
4. Адаптируешь (убираешь `LanguageContext` или меняешь на `next-intl`,
   меняешь font-tech на проектный шрифт, разворачиваешь Tailwind в SCSS
   Modules, etc.)
5. **Обязательно** создаёшь `60 - Reuse Log/YYYY-MM-DD <component> → <project>.md`
   с описанием адаптаций — это память переноса

## Принцип: это референс, а не dependency

- Никаких version pin'ов, changelog'ов, breaking-change policy — компонент
  меняется когда его нужно улучшить, а зависимые проекты уже скопировали
  свои версии.
- Никаких unit-тестов на компоненты — визуальное подтверждение через браузер.
- Никакой публикации на npm.
- API компонентов оформляется **человеко-читаемо**, не «правильно» —
  если props понятны из JSX, докум-файла catalog-entry достаточно.

## Tech Stack

| Слой | Технология |
| --- | --- |
| Bundler | **Vite 6** |
| Framework | **React 19** + TypeScript (не strict) |
| Стили | **Tailwind CSS 4** через CDN в `index.html` + `@tailwindcss/vite` плагин (ADR-004 — пока оставляем CDN) |
| Иконки | `lucide-react` (через importmap, не bundle) |
| Анимация | Framer Motion (selective), CSS animations, canvas 2D |
| AI (optional) | `@google/genai` в builder-режиме |
| Routing | hash-based (`#builder`, `#sandbox`, default wooden) |
| Code-split | `React.lazy` на уровне 3 режимов |
| Деплой | **GitHub Pages** через Actions (ADR-005) |

### docs-site/ (рендер волта)

| Слой | Технология |
| --- | --- |
| Framework | Next.js 16 (App Router, `output: "export"`) |
| Контент | MDX из `../docs/` |
| Стили | SCSS Modules + cascade layers |
| Поиск | Pagefind |
| Деплой | TBD — GH Pages или Netlify, см. backlog |

## Архитектура src/

**FSD-lite с доменным разделением по режимам:**

```
src/
├── main.tsx                   # entry + hash-router + 3 Suspense lazy-mode
├── App.tsx                    # landing MatterForge (вкладывается в wooden/App)
├── components/                # 215 общих примитивов, 16 категорий
│   ├── bio/                   # 21 шт
│   ├── fluid/                 # 14 шт
│   ├── optical/               # 24 шт
│   ├── quantum/ gravity/ thermal/ neural/ kinetic/ …
│   └── system/                # 30 шт — неклассифицируемые «системные» виджеты
├── wooden/                    # режим Showcase (секции + локальные components)
├── builder/                   # режим Builder (визуальный конструктор)
├── sandbox/                   # режим Sandbox (песочница примитивов)
├── services/geminiService.ts  # Gemini API (только для builder)
├── translations.ts            # i18n ru/en
├── constants.tsx
└── types.ts
```

**Cross-mode rule:** компонент живёт в `src/components/<cat>/` если
переиспользуется хотя бы двумя режимами. Локальное для одного режима —
внутри `wooden/components/` или `builder/components/`.

## Структура репо

```
matter-forge/
├── docs/                           # Obsidian vault (Johnny Decimal)
│   ├── 00 - Indexes/               #   Dashboard, Map, Tags
│   ├── 10 - Vision/                #   манифест, принципы, роль шоукейса
│   ├── 20 - Design Language/       #   словарь метафор, токены, типографика
│   ├── 30 - Catalog/               #   16 категорий × компоненты (MDX)
│   ├── 40 - Architecture/          #   FSD, routing, 42 ADR/
│   │   └── 42 - ADR/
│   ├── 45 - Engineering Workflow/  #   git, PR, "как добавить компонент"
│   ├── 50 - Patterns & Motifs/     #   сквозные техники (refraction, glass, …)
│   ├── 60 - Reuse Log/             #   журнал переносов в другие проекты
│   ├── 70 - Session Logs/          #   хроника matter-forge
│   ├── 80 - Templates/             #   component-entry, ADR, reuse, pattern
│   ├── 90 - Ideas & Backlog/
│   └── 95 - Attachments/
├── docs-site/                      # Next.js 16 рендер волта (MDX + Pagefind)
├── src/                            # основной шоукейс (Vite + React)
├── scripts/check-secrets.sh        # pre-commit regex-scan
├── .claude/
│   ├── settings.local.json         # локальные permissions (gitignored)
│   ├── agents/
│   │   └── docs-sync.md            #   синхронизация Dashboard + Map + MEMORY
│   └── skills/
│       ├── catalog-entry.md        #   как писать запись компонента
│       ├── reuse-entry.md          #   как фиксировать перенос
│       ├── pattern-essay.md        #   как писать эссе о сквозной технике
│       ├── category-triage.md      #   в какую из 16 папок кладём новый
│       ├── design-vocabulary.md    #   словарь метафор (авторитет)
│       ├── session-log.md
│       ├── git-workflow.md
│       └── docs-writing.md
├── .github/workflows/deploy.yml    # GH Pages — сам шоукейс
├── CLAUDE.md
├── README.md
└── .gitignore
```

## Джонни-Десимал модули (смысл)

| # | Модуль | Когда писать сюда |
| - | ------ | ----------------- |
| 00 | Indexes | Dashboard (статус + приоритет), Map of Everything, Tags index |
| 10 | Vision | редко — только когда меняется видение проекта |
| 20 | Design Language | когда добавляется новое слово в словарь метафор, новый токен, новый визуальный приём, который станет общим |
| 30 | Catalog | **при каждом новом компоненте.** Один MDX на компонент, frontmatter с тегами |
| 40 | Architecture | ADR на каждое значимое решение (структура, стек, паттерн) |
| 45 | Engineering Workflow | git/PR/релизы + «как добавить компонент» — редко меняется |
| 50 | Patterns & Motifs | когда замечаешь сквозную технику в ≥3 компонентах — эссе на 1–3 стр |
| 60 | Reuse Log | **при каждом переносе компонента в другой проект** — обязательно |
| 70 | Session Logs | в конце сессии с реальной работой в самом matter-forge |
| 80 | Templates | только когда добавляешь новый тип документа в волт |
| 90 | Ideas & Backlog | на ходу — что хочется добавить/переделать |
| 95 | Attachments | скрины, gif, видео, внешние референсы |

## Workflow

- **Новый компонент** → `category-triage` (куда класть) → файл в
  `src/components/<cat>/Name.tsx` → запись в `30 - Catalog/<cat>/<Name>.mdx`
  по шаблону из `80 - Templates/component-entry.mdx` → session log
- **Перенос компонента в другой проект** → создать файл
  `60 - Reuse Log/YYYY-MM-DD Name → project.md` по шаблону
  `80 - Templates/reuse-entry.md` с описанием адаптаций
- **Новый сквозной паттерн** (замечен в ≥3 компонентах) → эссе в
  `50 - Patterns & Motifs/<Pattern>.md`, обновить теги во всех
  задействованных catalog-entry
- **Новое архитектурное решение** → ADR в `40 - Architecture/42 - ADR/ADR-NNN Title.md`
- **Session log** — в конце сессии: `70 - Session Logs/YYYY-MM-DD HH:mm topic.md`
- **Memory** — `~/.claude/projects/-Users-vladimirmazyrec-Documents-matterforge-showcase/memory/`
- **Коммиты** — conventional commits
- **Sub-агент `docs-sync`** — после значимых изменений (новый ADR, новый
  компонент, новый reuse-entry, новый pattern-essay) вызывать
  `Agent({subagent_type: "docs-sync", prompt: "<что изменилось>"})`
  вместо ручного апдейта Dashboard/Map/MEMORY

## Redaction policy

В публичные документы **никогда** не попадают:
- `GEMINI_API_KEY` и любые API-ключи
- Личные email/телефоны, внутренние ссылки
- Пути, содержащие чужие имена пользователей

Всё перечисленное заменяется на `████` (U+2588). Реальные значения — в
`.env.local` (gitignored). Pre-commit hook `scripts/check-secrets.sh`
проверяет регулярками. Подробности — `.claude/skills/redaction.md` (добавить
когда возникнет реальная потребность, пока проект без секретов).

## Ключевые документы

**Always:**
- `docs/00 - Indexes/Dashboard.md`
- `CLAUDE.md` (этот файл)
- `docs/10 - Vision/Manifesto.md`
- `docs/20 - Design Language/Metaphor Dictionary.md`

**При работе с компонентами:**
- `docs/30 - Catalog/` + соответствующий `<category>/` README
- `docs/50 - Patterns & Motifs/` для сквозных техник
- `docs/80 - Templates/component-entry.mdx`

**При переносе в другой проект:**
- `docs/60 - Reuse Log/`
- `docs/80 - Templates/reuse-entry.md`

## Внешние ссылки

- Репо: <https://github.com/uladzimir23/matter-forge>
- Шоукейс: <https://uladzimir23.github.io/matter-forge/>
- Оригинальный `library/`: `~/Documents/library/` (не трогаем)
- Потребители шоукейса: `~/Documents/moreminsk`, `~/Documents/comforthotel`,
  `~/Documents/neuro-center`, `~/Documents/wedding`
