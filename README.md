<div align="center">

<img src="public/favicon.svg" width="56" height="56" alt="Code Practice Platform" />

# Code Practice Platform

**Практика, которая держит тебя в форме.**<br />
Тренажёр для подготовки к frontend-собеседованиям и ежедневной поддержки навыков.

<br />

[**Зеркало на Vercel**](https://code-practice-platform-omega.vercel.app/) &nbsp;·&nbsp; [**Зеркало на GitHub Pages**](https://evgeniibogdanov.github.io/code-practice-platform/)

<br />

[![CI](https://img.shields.io/github/actions/workflow/status/EvgeniiBogdanov/code-practice-platform/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/EvgeniiBogdanov/code-practice-platform/actions/workflows/ci.yml)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/EvgeniiBogdanov/code-practice-platform/badge?style=flat-square)](https://scorecard.dev/viewer/?uri=github.com/EvgeniiBogdanov/code-practice-platform)
[![Version](https://img.shields.io/badge/version-2.4.30-black?style=flat-square)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-source--available-black?style=flat-square)](LICENSE.md)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](tsconfig.json)
[![Architecture](https://img.shields.io/badge/architecture-FSD_2.1-black?style=flat-square)](https://feature-sliced.design)
[![Stars](https://img.shields.io/github/stars/EvgeniiBogdanov/code-practice-platform?style=flat-square&logo=github&color=black)](https://github.com/EvgeniiBogdanov/code-practice-platform/stargazers)

<br />

<img width="3456" height="1826" alt="Code Practice Platform" src="https://github.com/user-attachments/assets/7a0e2ac9-bdbd-4ab7-aa28-ec12f0d76b96" />

</div>

<br />

## О проекте

Собеседование решается практикой, а форма — регулярностью. Платформа собирает всё для этого в одном месте и работает без бэкенда: аккаунт — это только имя, а задачи, решения и прогресс хранятся в браузере.

| Раздел         | Задач | Что внутри                                                              |
| :------------- | ----: | :---------------------------------------------------------------------- |
| **JavaScript** |   257 | От var/let/const и типов до this, классов, Event Loop и MyPromise       |
| **TypeScript** |    54 | От аннотаций и сужения типов до infer, вариантности и рекурсивных типов |
| **React**      |   101 | Хуки и Actions React 19, перерендеры, Zustand, Redux и TanStack Query   |
| **Алгоритмы**  |    58 | Two Pointers, Sliding Window, графы и деревья с визуализацией O(N)/O(1) |

## Возможности

- **Цикл практики.** Решение в редакторе, сверка с эталоном (O(N) / O(1), подводные камни, вопросы интервьюера) и закрепление повторениями.
- **Индекс вероятности.** Оценка шанса встретить задачу на live coding уровня Middle и Senior и мета-бейджи: алгоритм, паттерн, полифил, утилита.
- **Интервальные повторения.** Помощник планирует повторы через 1 → 3 → 7 → 14 → 30 дней, напоминает о просрочках и показывает прогресс освоения.
- **Редактор уровня VS Code.** Мультикурсоры, перемещение строк, Emmet, автозакрытие тегов, форматирование Prettier 3, IntelliSense и проверка типов TypeScript.
- **Живой запуск.** Сплит-режим 70/30 с изолированной `iframe`-песочницей: React 19, TSX, CSS, Zustand и Redux Toolkit, логи в консоль.
- **Песочница кандидата.** Код с типичными багами и антипаттернами для тренировки Code Review.
- **Визуализатор алгоритмов.** Пошаговые 2D/3D-сцены на Three.js.
- **Быстрый поиск и избранное.** Command Palette (<kbd>⌘</kbd> <kbd>K</kbd>), дерево избранных задач и таймер собеседования.
- **Local-first.** IndexedDB с кэшем в памяти и синхронизацией между вкладками через `BroadcastChannel`. Без почты, пароля и серверов.

## Быстрый старт

Нужны **Node.js** (LTS) и **npm**.

```bash
git clone https://github.com/EvgeniiBogdanov/code-practice-platform.git
cd code-practice-platform
npm install
npm run dev
```

Приложение откроется на <http://localhost:4000/code-practice-platform/>.

| Команда                 | Назначение                       |
| :---------------------- | :------------------------------- |
| `npm run dev`           | Dev-сервер                       |
| `npm run build`         | Production-сборка                |
| `npm run preview`       | Локальный просмотр сборки        |
| `npm run typecheck`     | Проверка типов                   |
| `npm run lint`          | ESLint                           |
| `npm run format:check`  | Проверка форматирования Prettier |
| `npm run test:unit`     | Все тесты (Vitest)               |
| `npm run test:coverage` | Тесты с отчётом о покрытии       |
| `npm run test:e2e`      | E2E и a11y (Playwright + axe)    |
| `npm run size`          | Бюджет бандла (после `build`)    |

## Технологии

| Область           | Стек                                                                   |
| :---------------- | :--------------------------------------------------------------------- |
| Ядро              | React 19, TypeScript 7 (strict), Vite 8                                |
| Архитектура       | Feature-Sliced Design 2.1, TanStack Router                             |
| Состояние         | Zustand 5 (клиент), Redux Toolkit 2 (песочница Redux-задач)            |
| Редактор и запуск | Sucrase, Prettier 3 Standalone, Emmet, xterm.js 6, Web Workers, iframe |
| Визуализация      | Three.js, Nivo                                                         |
| Хранилище         | IndexedDB, `BroadcastChannel`                                          |
| Качество          | Vitest, Testing Library, ESLint, Prettier, GitHub Actions              |

## Архитектура

Код организован по [Feature-Sliced Design](https://feature-sliced.design): зависимости идут строго сверху вниз, слайсы открывают публичный API только через `index.ts`.

```
src/
├── app/        инициализация, провайдеры, точки входа (лендинг и рабочее пространство)
├── pages/      страницы: landing, home, task, favorites, open-editor …
├── widgets/    крупные блоки интерфейса: сайдбар, шапка, модалки
├── features/   пользовательские сценарии: редактор, запуск кода, повторения
├── entities/   предметные сущности: задачи, прогресс, повторения
└── shared/     UI-кит, библиотеки, конфиг
```

## Горячие клавиши

| macOS                                                 | Windows / Linux                                             | Действие                            |
| :---------------------------------------------------- | :---------------------------------------------------------- | :---------------------------------- |
| <kbd>⌘</kbd> <kbd>K</kbd>                             | <kbd>Ctrl</kbd> <kbd>K</kbd>                                | Быстрый поиск задач                 |
| <kbd>⌘</kbd> <kbd>Enter</kbd>                         | <kbd>Ctrl</kbd> <kbd>Enter</kbd>                            | Запустить код                       |
| <kbd>⌘</kbd> <kbd>D</kbd>                             | <kbd>Ctrl</kbd> <kbd>D</kbd>                                | Следующее совпадение (мультикурсор) |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>L</kbd>                | <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>L</kbd>               | Все совпадения выделенного слова    |
| <kbd>⌥</kbd> <kbd>↑</kbd> / <kbd>↓</kbd>              | <kbd>Alt</kbd> <kbd>↑</kbd> / <kbd>↓</kbd>                  | Переместить строку или блок         |
| <kbd>⇧</kbd> <kbd>⌥</kbd> <kbd>↑</kbd> / <kbd>↓</kbd> | <kbd>Shift</kbd> <kbd>Alt</kbd> <kbd>↑</kbd> / <kbd>↓</kbd> | Дублировать строку или блок         |
| <kbd>⇧</kbd> <kbd>⌥</kbd> <kbd>F</kbd>                | <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>L</kbd>                 | Форматировать через Prettier        |
| <kbd>⌃</kbd> <kbd>Space</kbd>                         | <kbd>Ctrl</kbd> <kbd>Space</kbd>                            | Подсказки IntelliSense              |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>Space</kbd>            | <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>Space</kbd>           | Подсказка параметров функции        |
| <kbd>⌘</kbd> <kbd>/</kbd>                             | <kbd>Ctrl</kbd> <kbd>/</kbd>                                | Строчный комментарий                |
| <kbd>F11</kbd>                                        | <kbd>F11</kbd>                                              | Полноэкранный редактор              |
| <kbd>Esc</kbd>                                        | <kbd>Esc</kbd>                                              | Закрыть окно, подсказку или поиск   |

## Участие в разработке

Issues и pull request'ы приветствуются. Перед отправкой изменений прогоните проверки:

```bash
npm run typecheck && npm run lint && npm run format:check && npm run test:unit
```

После `npm install` [Lefthook](https://lefthook.dev) ставит git-хуки: перед коммитом Prettier и ESLint (`--max-warnings 0`) прогоняются по staged-файлам, перед push — `npm run typecheck`. Пропустить разово: `LEFTHOOK=0 git commit ...`.

CI в PR дополнительно проверяет порог покрытия, бюджет бандла (`size-limit`), E2E и доступность на собранном приложении (Playwright + axe), Lighthouse и новые зависимости. В `main` попадают только squash-merge'ем PR с зелёным `CI OK`; заголовок PR должен следовать [Conventional Commits](https://www.conventionalcommits.org/ru/v1.0.0/) — он становится сообщением коммита.

Шаблон описания PR лежит в [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md). История изменений — в [CHANGELOG.md](CHANGELOG.md).

## Лицензия

Исходно-доступная некоммерческая лицензия, подробности в [LICENSE.md](LICENSE.md).

<div align="center">

<br />

Если проект полезен, поставь ⭐ — это помогает другим его найти.

</div>
