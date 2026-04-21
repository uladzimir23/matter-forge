---
date: 2026-04-21
topic: Vault + docs-site pipeline
duration: ~2h (в рамках одной конверсации)
outcomes:
  - vault_skeleton_created
  - claude_skills_and_agent_written
  - initial_adrs_documented
  - docs_site_copied_from_comforthotel
related_adr: [ADR-001, ADR-002, ADR-003, ADR-004, ADR-005]
related_components: []
related_reuse: []
---

# 2026-04-21 — Vault + docs-site pipeline

## Контекст

Утром завершили экстракцию matter-forge из `library/`, категоризацию 215
компонентов в 16 папок, и code-split режимов через `React.lazy`. Проект
задеплоен на <https://uladzimir23.github.io/matter-forge/>.

Днём возник вопрос: как организовать документацию. У comforthotel есть
рабочий пайплайн Obsidian-vault + docs-site на Next.js. Для matter-forge
решили адаптировать тот же подход, но под специфику референс-проекта.

## Что сделано

### 1. Спроектирован свой набор Johnny Decimal модулей

Не копия comforthotel (там был бриф/аудит/SEO/миграция клиентского проекта),
а специфика matter-forge:

- **00 — Indexes** — Dashboard, Map, Tags
- **10 — Vision** — манифест, принципы
- **20 — Design Language** — словарь метафор, токены
- **30 — Catalog** — 16 категорий × компоненты (ядро волта)
- **40 — Architecture** — FSD, routing, 42 ADR/
- **45 — Engineering Workflow** — git, «как добавить компонент»
- **50 — Patterns & Motifs** — сквозные техники
- **60 — Reuse Log** — журнал переносов в другие проекты
- **70 — Session Logs**
- **80 — Templates** — component-entry, ADR, pattern-essay, reuse-entry
- **90 — Ideas & Backlog**
- **95 — Attachments**

Ключевое отличие от comforthotel: **20 Design Language, 50 Patterns &
Motifs, 60 Reuse Log** — три модуля, которых у обычного клиентского
проекта быть не может. Они составляют ядро референс-проекта.

### 2. Написан CLAUDE.md

Полный контекст проекта для будущих сессий: видение, стек, архитектура,
workflow, ссылки на ключевые документы.

### 3. Написаны 8 скиллов в `.claude/skills/`

- `catalog-entry.md` — как документировать компонент
- `reuse-entry.md` — как фиксировать перенос в другой проект
- `pattern-essay.md` — как писать эссе о сквозной технике
- `category-triage.md` — дерево решений на 16 категорий
- `design-vocabulary.md` — словарь метафор, правила использования
- `session-log.md`
- `git-workflow.md`
- `docs-writing.md`

### 4. Написан sub-агент `docs-sync`

Scoped agent с доступом только к `Read/Write/Edit/Glob/Grep`. Его
ответственность — Dashboard.md, Map.md, Tags.md, MEMORY.md. Не создаёт
новые ADR/entries/logs — только индексирует.

### 5. Заполнен начальный контент

- `Dashboard.md` — со счётчиками по категориям
- `Map.md` — дерево модулей
- `Tags.md` — пустой placeholder
- `Vision/Manifesto.md` — развёрнутый манифест
- `Design Language/Metaphor Dictionary.md` — словарь ~60 слов по 10 семьям
- `Architecture/FSD.md` — описание раскладки
- ADR-001..005 — экстракция, категоризация, code-split, Tailwind на CDN,
  GH Pages деплой
- `Engineering Workflow/Branching.md` + `How to add a component.md`
- 4 шаблона в `80 - Templates/`

## Развилки и решения

### Catalog-entry: сразу 215 или по запросу?

**Решено:** по запросу. Создавать MDX-запись при необходимости (перенос,
важное наблюдение, deprecated-пометка). Не писать 215 пустых страниц —
это шум, через год никто не будет читать.

Счётчик в Dashboard отражает разницу: «0 / 215» — физические файлы есть,
catalog-entries нет.

### docs-site: деплоим сейчас или позже?

**Решено:** позже. Сначала наполнить волт первыми записями, потом
скопировать `docs-site/` из comforthotel и настроить Netlify. Если
деплоить пустой сайт — нет содержимого для проверки рендера.

## Что не получилось / отложено

- **Копирование `docs-site/`** — отложено до следующей сессии, когда
  будут первые catalog-entries и pattern-essay для проверки рендера.
- **Netlify config** — появится вместе с docs-site.
- **Pre-commit hook** для проверки секретов — создан скрипт в `scripts/`,
  но не подключён к git-hooks (сейчас не критично, секретов в репо нет).

## Следующие шаги

- [ ] Перенести `docs-site/` из comforthotel, адаптировать пути (`../docs/`
      должен работать), поменять `name`, settings под matter-forge
- [ ] Написать первый pattern-essay — вероятно `Refraction Layer` (охватывает
      ChromaCore, ChromaticDispersion, RefractiveHUD, PrismaticFlux,
      SpectralWarp)
- [ ] Написать 3–5 catalog-entries для самых ходовых компонентов
- [ ] Netlify-setup для docs-site
- [ ] Смигрировать Tailwind с CDN на локальный билд
- [ ] Слить два `LanguageContext`

## Артефакты

- Репо: <https://github.com/uladzimir23/matter-forge>
- Deploy: <https://uladzimir23.github.io/matter-forge/>
- Коммит с vault-пайплайном: _добавится при коммите_
