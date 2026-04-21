---
title: ADR-002 Category taxonomy (16 folders)
date: 2026-04-21
status: accepted
---

# ADR-002 Таксономия 16 категорий для src/components/

## Контекст

После экстракции ([[ADR-001 Extracted from library]]) все 215 компонентов
лежали плоским списком в `src/components/`. Поиск был болью: зная что
нужен «компонент с преломлением» — приходилось скроллить 215 файлов
глазами.

Нужна была группировка. Критерии:
- **≥5 компонентов в каждой папке** — если папок слишком много и
  некоторые пустые, это фейл
- **≤30 компонентов в папке** — иначе внутри папки снова каша
- **Категория — про метафору**, не про технологию (canvas/svg — не
  категории)
- **Согласованная семантика** — компонент должен попадать в одну папку
  однозначно

## Решение

16 папок по метафорическим семьям:

| Категория | Кол-во | Примерные имена |
|-----------|--------|-----------------|
| bio | 21 | BioLatticeSkin, MembraneGenesis, DendriticGrowth |
| fluid | 14 | CapillaryFlowSync, FerrofluidSpikeType, VortexFluidTrail |
| optical | 24 | ChromaCore, RefractiveHUD, SpectralWarp |
| quantum | 9 | QuantumEntanglementPair, PhaseCrystal |
| gravity | 7 | GravitationalDataWell, OrbitalDecayPlatform |
| thermal | 6 | ThermalExpansionCore, CryoContainmentVault |
| neural | 20 | NeuralSynapseEngine, SynapticRelay |
| kinetic | 24 | KineticMomentumDecay, InertialMomentumSlab |
| atmospheric | 5 | AetherialVapor, AtmosphericVolume |
| acoustic | 11 | AcousticFeedback, HarmonicResonanceSurface |
| volumetric | 11 | VolumetricChartCore, HolographicArray |
| structural | 8 | LatticePulse, ModularLattice |
| topology | 7 | TopologicalMorph, SpatialOrbitalNav |
| state | 8 | StateMorpher, EntropyGridShift |
| molecular | 10 | MolecularFusion, AtomicAssembly |
| system | 30 | CommandCenter, DevOpsPipeline, SyntaxIDE |

Итого 215 = сумма. Ни одна папка не пустая, самая большая (`system`) — 30.

## Отвергнутые альтернативы

- **Плоская структура + теги** — теги удобно для поиска, но для
  ориентации в IDE всё равно нужна физическая группировка.
- **По технологии (canvas/ svg/ css)** — не коррелирует с задачей «найди
  эффект».
- **По режиму (wooden/ builder/ sandbox)** — нарушает cross-mode
  использование.
- **По сложности (simple/ advanced)** — субъективно, не помогает.

## Имплементация

- Скрипт `/tmp/mf-categorize.py` — `git mv` в 16 папок + regex rewrite
  импортов в коде.
- Second pass для nested компонентов (`components/<cat>/*.tsx`) —
  сдвиг `../App` → `../../App`.

## Последствия

- **+** Навигация по IDE стала читаемой — каждая папка ~10–30 файлов.
- **+** `category-triage` скилл даёт однозначный ответ куда класть новый.
- **+** Имена категорий совпадают с тегами словаря метафор — синергия.
- **–** Переименования `./Other` в импорте внутри категории могли сломать
  side-effect-import'ы (не сломали, но теоретически).
- **–** Категория `system` — escape hatch, может разрастись до каши.
  **Митигация:** если `system/` превысит 40 — разделить на `system/tools/`,
  `system/shell/`, `system/meta/` под-категориями.

## Связанные

- [[.claude/skills/category-triage]]
- [[20 - Design Language/Metaphor Dictionary]]
- [[70 - Session Logs/2026-04-21 Vault + docs-site pipeline]]
