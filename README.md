# Matter Forge

Референс-шоукейс визуальных интерфейсов. Коллекция из **200+ React-компонентов** — от био-решёток и квантовых полей до термальных мешей и тактильных консолей. Источник идей и кода для новых проектов.

Деплой: https://uladzimir23.github.io/matter-forge/

## Стек

- **Vite 6** + **React 19** + **TypeScript**
- **Tailwind CSS 4** (через `<script>` CDN + `@tailwindcss/vite`)
- **lucide-react** иконки
- **@google/genai** — опциональные AI-фичи в builder-режиме

## Режимы работы (hash-routing)

- `/` — **Showcase** (wooden): основной шоурум с генезисом, таймлайном, техническими столпами и живыми демо
- `#builder` — визуальный билдер лендингов
- `#sandbox` — песочница атомарных примитивов

Между режимами переключает плавающий HUD в правом нижнем углу.

## Структура

```
matter-forge/
├── src/
│   ├── main.tsx               # entry, hash-router по 3 режимам
│   ├── App.tsx                # landing-компонент MatterForge
│   ├── components/            # 200+ общих визуальных примитивов
│   ├── wooden/                # режим Showcase (локальные секции)
│   ├── builder/               # режим Builder
│   ├── sandbox/               # режим Sandbox
│   ├── services/              # geminiService
│   ├── translations.ts        # i18n (ru/en)
│   ├── constants.tsx
│   └── types.ts
├── public/
├── index.html                 # Tailwind CDN config, глобальные стили
├── vite.config.ts             # alias @/, base='/matter-forge/' на Pages
├── tsconfig.json
└── .github/workflows/deploy.yml  # CI → GitHub Pages
```

## Локально

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # сборка в dist/
npm run preview   # предпросмотр билда
```

### Опционально: Gemini API

Создай `.env.local` с ключом, если нужен builder с AI-генерацией:

```
GEMINI_API_KEY=your_key_here
```

## Деплой

Пуш в `main` → GitHub Actions собирает и публикует на GitHub Pages (`/matter-forge/` базовый путь).

Локально повторить прод-сборку:

```bash
GITHUB_ACTIONS=true npm run build
```

## Как использовать как референс

1. Заходи на задеплоенный шоукейс, находи нужный эффект.
2. Ищешь его исходник в `src/components/<Name>.tsx` или в `src/wooden/components/`.
3. Копируешь код в свой проект; если используется `LanguageContext` — пробрось заглушку или собственный провайдер.

## Roadmap

- [ ] Категоризация 200+ примитивов по темам (bio, fluid, quantum, optical, …)
- [ ] Миграция Tailwind с CDN на локальный билд через `@tailwindcss/vite`
- [ ] Code-splitting режимов (сейчас один бандл ~1.1MB)
- [ ] Страница каталога с поиском и фильтрами по категориям
