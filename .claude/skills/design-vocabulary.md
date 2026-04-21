---
name: design-vocabulary
description: Authoritative glossary of metaphor words used in matter-forge. Trigger when tagging a catalog-entry, naming a component, writing a pattern essay, or deciding if a new metaphor deserves inclusion.
---

# Design Vocabulary

Словарь метафор — это **фиксированное подмножество слов**, которыми мы
описываем компоненты в шоукейсе. Живой источник — `docs/20 - Design Language/Metaphor Dictionary.md`,
этот скилл — про то, **как пользоваться словарём** и **как его расширять**.

## Зачем словарь

Без словаря теги превращаются в мусор: `cool`, `shiny`, `modern`, `fancy`.
Они не помогают найти компонент и не говорят ни о чём содержательно.

Словарь даёт:
- **однозначность** — `refraction` всегда про преломление света, а не про
  «стилизацию»
- **композиционность** — метафоры из словаря можно комбинировать
  (`refraction + haptic + glass`)
- **кросс-категорийность** — тег `haptic` работает в `acoustic`,
  `kinetic`, `system` (command center с haptic feedback)

## Основа словаря

Словарь строится вокруг физики и биологии. Слова сгруппированы по семьям:

### Optical
`refraction`, `reflection`, `dispersion`, `caustic`, `spectral`, `prismatic`,
`chromatic`, `luminous`, `occlusion`, `subsurface-scattering`

### Fluid
`capillary`, `osmosis`, `surface-tension`, `viscous`, `turbulent`,
`ferrofluid`, `tidal`, `buoyancy`, `hydrostatic`

### Kinetic
`momentum`, `inertia`, `elastic`, `spring`, `decay`, `damping`,
`collision`, `constraint`

### Bio
`membrane`, `mitosis`, `dendritic`, `vascular`, `ciliary`, `phototactic`,
`homeostatic`, `mycelial`, `respiratory`

### Haptic / Acoustic
`haptic`, `tactile`, `harmonic`, `resonance`, `interference`, `levitation`,
`sonic`

### Quantum
`entanglement`, `superposition`, `phase`, `tachyon`, `singularity`

### Gravity / Thermal / Atmospheric
`orbital`, `gravitational`, `plasma`, `cryogenic`, `crystalline`,
`atmospheric`, `vapor`, `aetherial`

### Neural
`synaptic`, `dendrite`, `resonance` (neural context), `topology`, `pulse`,
`trace`

### Volumetric / Topological / Structural
`volumetric`, `holographic`, `parallax`, `z-stack`, `topological`,
`morph`, `lattice`, `stacking`, `modular`

### Technical (неметафоричные, но контролируемые)
`canvas`, `svg`, `webgl`, `css-only`, `dom-anim`, `mixed-rendering`

## Правила использования

1. **Тегать из словаря**. Если нужного слова в словаре нет — см. расширение
   ниже, не придумывать на ходу.
2. **3–7 тегов на компонент**. Меньше — бесполезно искать, больше — шум.
3. **Хотя бы 1 технический тег** (`canvas`, `svg`, `css-only`, `webgl`,
   `dom-anim`).
4. **Метафорические теги могут быть кросс-категорийными.** Компонент из
   `kinetic` может иметь тег `haptic` если уместно.
5. **Имена компонентов тоже должны читаться через словарь.** `ChromaCore`,
   `RefractiveHUD`, `KineticMomentumDecay` — все составлены из словарных
   слов. Новое имя, которое нельзя разобрать словарём (`FooBar`,
   `AwesomeThing`), — плохое имя.

## Расширение словаря

Новое слово попадает в словарь, если:
- Оно описывает метафору, а не декорацию (не `sparkle`, не `glow`).
- Оно нужно для **≥2 компонентов** (одиночный случай — не словарное слово).
- Оно не дубль существующего (если уже есть `resonance` — `vibration`
  избыточен).
- Оно из физики/биологии/материи/системной теории — домен matter-forge.

**Процедура:** новое слово → апдейт `docs/20 - Design Language/Metaphor Dictionary.md`
в соответствующей семье → session log в 70 с упоминанием «расширили словарь:
добавили `<word>` потому что …».

## Anti-patterns

- **Слова-оценки.** `cool`, `beautiful`, `premium`, `modern`. Не несут смысла.
- **Слова-бренды.** `apple-style`, `awwwards-style`. Слишком узко и стареет.
- **Слова-функции.** `button`, `modal`, `card`. Это форма, не метафора.
- **Английский + русский mix.** Весь словарь по-английски (совпадает с
  именами компонентов).

## После добавления слова

Пройтись по существующим catalog-entries и добавить новый тег туда, где
он теперь уместен (обычно 2–5 файлов).
