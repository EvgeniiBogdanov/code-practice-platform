<div align="center">

# <img src="public/favicon.svg" width="22" height="22" alt="" /> Code Practice Platform

<sub><span style="color:gray">version: 2.3.0</span></sub>

### Интерактивная платформа для подготовки к техническим собеседованиям по фронтенду и алгоритмам

<br />

<img width="1721" height="886" alt="Code Practice Platform Preview" src="https://github.com/user-attachments/assets/3bf6c943-4566-4642-98c0-d4ae3aaeb6ef" />

<br /><br />

[![Онлайн-версия](https://img.shields.io/badge/Открыть_в_браузере-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://code-practice-platform-omega.vercel.app/home)

<br />

[![GitHub Stars](https://img.shields.io/github/stars/EvgeniiBogdanov/code-practice-platform?style=flat-square&label=Stars&color=yellow&logo=github)](https://github.com/EvgeniiBogdanov/code-practice-platform/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/EvgeniiBogdanov/code-practice-platform?style=flat-square&label=Forks&color=blue&logo=github)](https://github.com/EvgeniiBogdanov/code-practice-platform/network/members)
[![License](https://img.shields.io/github/license/EvgeniiBogdanov/code-practice-platform?style=flat-square&color=green)](LICENSE.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_7.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](tsconfig.json)
[![FSD](https://img.shields.io/badge/Architecture-FSD_v2.1-blue?style=flat-square)](https://feature-sliced.design)

<br />

**[🚀 Демо](https://code-practice-platform-omega.vercel.app/home)** ·
**[✨ Возможности](#-ключевые-возможности)** ·
**[🛠️ Стек](#️-технологический-стек)** ·
**[⚙️ Установка](#️-установка-и-запуск)** ·
**[⌨️ Горячие клавиши](#️-горячие-клавиши)** ·
**[📜 Changelog](#-история-версий)**

</div>

---

## ✨ Ключевые возможности

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🎯 300+ задач с реальных интервью</h3>
      <p>База задач по <b>React + TypeScript</b>, <b>JavaScript</b> (от замыканий до Event Loop и промисов) и <b>алгоритмам</b>. Эталонные решения с оценкой <code>O(N)</code> / <code>O(1)</code>, поиск багов и чеклисты самопроверки.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🧠 Интервальное повторение (SM-2)</h3>
      <p>Адаптированный алгоритм интервального запоминания (<code>1д → 3д → 7д → 14д → 30д → 60+д</code> / Мастер) с учётом таймзон, автоматическим сбросом решений в день повтора и шкалой мастерства.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>⚛️ React Live Runner & Node.js Sandbox</h3>
      <p>Изолированная <code>iframe</code>-песочница с перехватом рантайм-ошибок для React/TSX на <b>Sucrase</b> и Web Worker для мгновенного исполнения JavaScript/Node.js с терминалом <b>xterm.js</b> и замером времени выполнения.</p>
    </td>
    <td width="50%" valign="top">
      <h3>💻 Собственный редактор кода</h3>
      <p>Лёгкий редактор без нагрузки на бандл. Мультикурсоры (<code>Cmd+D</code> / <code>Cmd+Shift+L</code>), перемещение строк (<code>Alt+↑/↓</code>), контекстный IntelliSense (JS, TSX, CSS, HTML), форматирование <b>Prettier 3</b>, Emmet и линтинг.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>📊 Аналитика и визуализация прогресса</h3>
      <p>Интерактивные графики на <b>Visx 4</b>, кольцевые диаграммы освоения разделов, статистика решений по категориям сложности и детальный трекинг подготовки.</p>
    </td>
    <td width="50%" valign="top">
      <h3>💾 Zero-Lag Dual Storage & Sync</h3>
      <p>Двухуровневое хранилище (L1 LocalStorage кэш + L2 IndexedDB v3) с автосохранением решений и межвкладочной синхронизацией в реальном времени через <code>BroadcastChannel API</code>.</p>
    </td>
  </tr>
</table>

---

## 🛠️ Технологический стек

<p align="center">
  <img src="https://img.shields.io/badge/React_19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript_7.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 7.0" />
  <img src="https://img.shields.io/badge/Vite_8_(Rolldown)-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/FSD_v2.1-FF6B6B?style=for-the-badge&logo=codewars&logoColor=white" alt="FSD v2.1" />
  <img src="https://img.shields.io/badge/TanStack_Router-FF4154?style=for-the-badge&logo=react&logoColor=white" alt="TanStack Router" />
  <img src="https://img.shields.io/badge/Zustand_5-443e38?style=for-the-badge&logo=react&logoColor=white" alt="Zustand 5" />
  <img src="https://img.shields.io/badge/Redux_Toolkit_2-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit 2" />
  <img src="https://img.shields.io/badge/Visx_4-FC521F?style=for-the-badge&logo=d3.js&logoColor=white" alt="Visx 4" />
  <img src="https://img.shields.io/badge/xterm.js_6-000000?style=for-the-badge&logo=gnometerminal&logoColor=white" alt="xterm.js 6" />
  <img src="https://img.shields.io/badge/Prettier_3-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier 3" />
</p>

| Категория                     | Технологии и библиотеки                                                                              |
| :---------------------------- | :--------------------------------------------------------------------------------------------------- |
| **Frontend Core**             | React 19.2 (`react`, `react-dom`), TypeScript 7.0, Vite 8 (движок Rolldown)                          |
| **Архитектура и роутинг**     | Feature-Sliced Design (FSD v2.1), TanStack Router (типобезопасная файловая маршрутизация)            |
| **Управление состоянием**     | Zustand 5 (стейт приложения и UI), Redux Toolkit 2 + React-Redux (песочница для задач по Redux)      |
| **Исполнение кода & Sandbox** | Sucrase (JSX/TSX транспайлер), xterm.js 6 (терминал), Web Workers, изолированный `iframe`-sandbox    |
| **Аналитика & графики**       | Visx 4 (`@visx/shape`, `@visx/scale`, `@visx/grid`, `@visx/tooltip`, `@visx/curve` и др.)            |
| **Хранение & синхронизация**  | LocalStorage (L1-кэш), IndexedDB v3 (L2), синхронизация между вкладками через `BroadcastChannel API` |
| **Инструменты кода**          | Prettier 3, Emmet, встроенный линтинг и IntelliSense                                                 |

---

## ⚙️ Установка и запуск

Требуется установленный **Node.js** (LTS-версия) и npm.

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/EvgeniiBogdanov/code-practice-platform.git
cd code-practice-platform

# 2. Установите зависимости
npm install

# 3. Запустите dev-сервер
npm run dev
```

Приложение будет доступно по адресу, который выведет Vite (обычно `http://localhost:5173`).

Для сборки production-версии:

```bash
npm run build
```

---

## ⌨️ Горячие клавиши

### Навигация по дереву сайдбара (WAI-ARIA Treeview)

| Клавиша / Сочетание                          | Действие                                                               |
| :------------------------------------------- | :--------------------------------------------------------------------- |
| <kbd>↓</kbd> / <kbd>↑</kbd>                  | Перемещение фокуса между видимыми строками дерева (папками и задачами) |
| <kbd>→</kbd>                                 | Раскрыть свернутую папку / перейти к первой дочерней задаче            |
| <kbd>←</kbd>                                 | Свернуть открытую папку / перейти к родительской теме                  |
| <kbd>Enter</kbd> / <kbd>Space</kbd>          | Открыть выбранную задачу / переключить состояние папки                 |
| <kbd>Home</kbd> / <kbd>End</kbd>             | Быстрый переход к первой / последней строке дерева                     |
| <kbd>Alt</kbd>+Клик / <kbd>Option</kbd>+Клик | Массовое сворачивание / разворачивание всех папок раздела              |

### Редактор кода: мультикурсоры и работа со строками (VS Code Style)

| macOS                                                              | Windows / Linux                                                 | Действие                                                      |
| :----------------------------------------------------------------- | :-------------------------------------------------------------- | :------------------------------------------------------------ |
| <kbd>⌘</kbd> + <kbd>D</kbd>                                        | <kbd>Ctrl</kbd> + <kbd>D</kbd>                                  | Выделить слово / добавить следующее совпадение (мультикурсор) |
| <kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd>                     | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd>               | Выделить все совпадения выделенного слова в документе         |
| <kbd>Option</kbd> + <kbd>↑</kbd> / <kbd>↓</kbd>                    | <kbd>Alt</kbd> + <kbd>↑</kbd> / <kbd>↓</kbd>                    | Переместить текущую строку / блок строк вверх / вниз          |
| <kbd>Shift</kbd> + <kbd>Option</kbd> + <kbd>↑</kbd> / <kbd>↓</kbd> | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>↑</kbd> / <kbd>↓</kbd> | Продублировать текущую строку / блок строк вверх / вниз       |
| <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd>                   | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>L</kbd>                 | Форматирование кода через Prettier 3                          |
| <kbd>⌘</kbd> + <kbd>F</kbd>                                        | <kbd>Ctrl</kbd> + <kbd>F</kbd>                                  | Поиск и замена в редакторе                                    |
| <kbd>Alt</kbd> + <kbd>Z</kbd>                                      | <kbd>Alt</kbd> + <kbd>Z</kbd>                                   | Переключение мягкого переноса строк (Word Wrap)               |
| <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd>                 | <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd>              | Добавить / убрать отступ для выделенных строк                 |
| <kbd>⌘</kbd> + <kbd>/</kbd>                                        | <kbd>Ctrl</kbd> + <kbd>/</kbd>                                  | Закомментировать / раскомментировать строку (`//`)            |
| <kbd>Esc</kbd> / Клик мыши                                         | <kbd>Esc</kbd> / Клик мыши                                      | Сброс мультикурсоров / закрытие окна подсказок                |

### Интеллектуальное автодополнение (IntelliSense & Snippets)

| Сочетание клавиш                   | Действие                                                                     |
| :--------------------------------- | :--------------------------------------------------------------------------- |
| <kbd>Ctrl</kbd> + <kbd>Space</kbd> | Вызов контекстного меню подсказок IntelliSense                               |
| <kbd>↓</kbd> / <kbd>↑</kbd>        | Навигация по списку предложенных ключевых слов, методов и сниппетов          |
| <kbd>Tab</kbd> / <kbd>Enter</kbd>  | Принять подсказку или развернуть сниппет (например, `clg` → `console.log()`) |
| <kbd>Esc</kbd>                     | Закрыть меню автодополнения без вставки текста                               |

### Рабочее пространство и глобальные шорткаты

| Сочетание клавиш                                                     | Действие                                                                |
| :------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| <kbd>⌘</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd>         | Палитра быстрого поиска задач по всем разделам платформы                |
| <kbd>⌘</kbd> + <kbd>Enter</kbd> / <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Запуск кода в терминале Node.js / песочнице React Live Runner           |
| <kbd>F11</kbd>                                                       | Полноэкранный режим редактора кода                                      |
| <kbd>Esc</kbd>                                                       | Закрыть активное модальное окно, подсказку (Tooltip) или палитру поиска |

---

## 📜 История версий

Полная история изменений — в файле **[CHANGELOG.md](CHANGELOG.md)**.

- **[v2.2.95](CHANGELOG.md#v2-2-95)** — Контекстный IntelliSense для JS/TS/React, мультикурсоры (Cmd+D), перемещение строк (Alt+↑/↓), умное управление консолью, редизайн модалок.
- **[v2.2.9](CHANGELOG.md#v2-2-9)** — WAI-ARIA Treeview навигация по сайдбару, оптимизация CSS Grid анимаций, NotificationBadge, Sticky Progress.
- **[v2.2.8](CHANGELOG.md#v2-2-8)** — Полная миграция на FSD v2.1, Strict TypeScript, посадочные страницы разделов, Prettier 3 Formatter, теория React+TS.
- **[v2.2.7](CHANGELOG.md#v2-2-7)** — Архитектурная изоляция песочницы React (`iframe`), автоподстройка высоты, нормализация Form Controls.
- **[v2.2.2](CHANGELOG.md#v2-2-2)** — Календарный SM-2 с учётом таймзоны, автосброс решений в день повтора.
- **[v2.2.1](CHANGELOG.md#v2-2-1)** — Умное интервальное повторение (SM-2), Radix-подобная система Tooltip, редизайн Header.

---

## 🤝 Вклад в проект

Мы приветствуем любые идеи, улучшения и исправления!

1. Сделайте **Fork** репозитория.
2. Создайте ветку: `git checkout -b feature/amazing-feature`.
3. Зафиксируйте изменения: `git commit -m "feat: add amazing feature"`.
4. Отправьте ветку в ваш форк: `git push origin feature/amazing-feature`.
5. Откройте **Pull Request**.

---

## 📄 Лицензия

Проект распространяется под лицензией [Source-Available Non-Commercial License](LICENSE.md). Свободно для личного обучения и подготовки к интервью.

---

<div align="center">

## 👤 Автор

**Евгений Богданов** — [GitHub профиль](https://github.com/EvgeniiBogdanov)

<br />

Если платформа помогла вам в подготовке — поддержите проект ⭐ **звёздочкой на GitHub**!

</div>
