<div align="center">

# <img src="public/favicon.svg" width="22" height="22" alt="" /> Code Practice Platform

<sub><span style="color:gray">version: 2.3.5</span></sub>

### Интерактивная платформа для подготовки к техническим собеседованиям по фронтенду и алгоритмам

<br />

<img width="1723" height="964" alt="Code Practice Platform Preview" src="https://github.com/user-attachments/assets/489061bb-f4a9-4417-aa1c-8031295f5eb3" />

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
      <h3>🎯 330+ задач с реальных интервью</h3>
      <p>Специализированный каталог задач по <b>JavaScript</b> (объекты, замыкания, Event Loop, асинхронность, полифилы), <b>React 19 + TypeScript</b> и <b>алгоритмам</b>. Эталонные решения O(N) / O(1), вариативность подходов и чеклисты самопроверки.</p>
    </td>
    <td width="50%" valign="top">
      <h3>📈 Индекс вероятности & мета-бейджи</h3>
      <p>Оценка вероятности встретить задачу на live coding для Middle/Senior (BigTech, FinTech, E-commerce) с круговым <b>Gauge-индикатором</b> и системой смысловых тегов (алгоритм, паттерн, полифил, утилита).</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🤖 Интервальный помощник & SM-2</h3>
      <p>Адаптированный алгоритм интервального закрепления (<code>1д → 3д → 7д → 14д → 30д</code>), интерактивный мотивационный помощник с отслеживанием просрочек, кастомизацией имени и возможностью исключения задач из цикла.</p>
    </td>
    <td width="50%" valign="top">
      <h3>⚛️ React Live Runner & Сплит-режим</h3>
      <p>Полноэкранный двухпанельный сплит (<b>70% код / 30% интерфейс</b>) с drag-and-drop ресайзом. Изолированная <code>iframe</code>-песочница с поддержкой React 19, TSX, CSS, Zustand/RTK и стримингом логов в консоль.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🔍 Песочница кандидата & Code Review</h3>
      <p>Запускаемый live-код с типичными багами и антипаттернами из реальных собеседований для тренировки навыка проведения технического Code Review.</p>
    </td>
    <td width="50%" valign="top">
      <h3>⭐ Избранное & Быстрый поиск</h3>
      <p>Полноценный раздел «Избранное» со структурированным деревом задач и фильтрами по статусу. Мгновенная палитра быстрого поиска <b>Command Palette</b> (<kbd>Cmd+K</kbd>) и таймер собеседования.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>💻 Продвинутый редактор кода</h3>
      <p>VS Code-подобный редактор: мультикурсоры (<kbd>Cmd+D</kbd>), перемещение строк (<kbd>Alt+↑/↓</kbd>), подсветка синтаксиса JS/TSX/CSS/HTML, Emmet, автоформатирование <b>Prettier 3</b> и контекстный IntelliSense.</p>
    </td>
    <td width="50%" valign="top">
      <h3>💾 Local-First & Zero-Lag Sync</h3>
      <p>Двухуровневое хранилище (L1 In-Memory кэш + L2 <b>IndexedDB</b> с самовосстановлением схемы). Мгновенный отклик без задержек и межвкладочная синхронизация прогресса через <code>BroadcastChannel API</code>.</p>
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
  <img src="https://img.shields.io/badge/Nivo_Charts-FF4757?style=for-the-badge&logo=d3.js&logoColor=white" alt="Nivo Charts" />
  <img src="https://img.shields.io/badge/xterm.js_6-000000?style=for-the-badge&logo=gnometerminal&logoColor=white" alt="xterm.js 6" />
  <img src="https://img.shields.io/badge/Prettier_3-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier 3" />
</p>

| Категория | Технологии |
| :--- | :--- |
| **Frontend Core** | React 19.2, TypeScript 7.0 (Strict), Vite 8 (Rolldown) |
| **Архитектура и роутинг** | Feature-Sliced Design (FSD v2.1), TanStack Router (типизированная файловая маршрутизация) |
| **Управление состоянием** | Zustand 5 (UI и данные приложения), Redux Toolkit 2 (песочница Redux-задач) |
| **Исполнение кода & Sandbox** | Sucrase (транспиляция JSX/TSX/CommonJS), xterm.js 6, Web Workers, изолированный `iframe` |
| **Аналитика & графики** | Nivo Charts (`@nivo/core`, `@nivo/pie`, `@nivo/bar`) |
| **Хранилище & синхронизация** | LocalStorage (L1-кэш), IndexedDB (L2 хранилище), `BroadcastChannel API` |
| **Инструменты редактора** | Prettier 3 Standalone, Emmet, лексеры JS/TSX/CSS/HTML, встроенный линтинг и IntelliSense |

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

Приложение будет доступно по адресу, указанному в терминале (обычно `http://localhost:5173`).

Для сборки production-версии:

```bash
npm run build
```

---

## ⌨️ Горячие клавиши

### Редактор кода (VS Code Style)

| macOS | Windows / Linux | Действие |
| :--- | :--- | :--- |
| <kbd>⌘</kbd> + <kbd>D</kbd> | <kbd>Ctrl</kbd> + <kbd>D</kbd> | Выделить слово / добавить следующее совпадение (мультикурсор) |
| <kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd> | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd> | Выделить все совпадения выделенного слова |
| <kbd>Option</kbd> + <kbd>↑</kbd> / <kbd>↓</kbd> | <kbd>Alt</kbd> + <kbd>↑</kbd> / <kbd>↓</kbd> | Переместить текущую строку или блок строк вверх / вниз |
| <kbd>Shift</kbd> + <kbd>Option</kbd> + <kbd>↑</kbd> / <kbd>↓</kbd> | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>↑</kbd> / <kbd>↓</kbd> | Продублировать текущую строку или блок строк |
| <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd> | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>L</kbd> | Форматирование кода через Prettier 3 |
| <kbd>Ctrl</kbd> + <kbd>Space</kbd> | <kbd>Ctrl</kbd> + <kbd>Space</kbd> | Вызов меню контекстных подсказок IntelliSense |
| <kbd>⌘</kbd> + <kbd>/</kbd> | <kbd>Ctrl</kbd> + <kbd>/</kbd> | Закомментировать / раскомментировать строку |

### Навигация и глобальные действия

| Сочетание / Клавиша | Область | Действие |
| :--- | :--- | :--- |
| <kbd>⌘</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> | Глобально | Палитра быстрого поиска задач (Command Palette) |
| <kbd>⌘</kbd> + <kbd>Enter</kbd> / <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Редактор | Быстрый запуск кода / тестов в песочнице |
| <kbd>F11</kbd> | Редактор | Переключение полноэкранного режима редактора |
| <kbd>↓</kbd> / <kbd>↑</kbd>, <kbd>→</kbd> / <kbd>←</kbd> | Сайдбар | Навигация по дереву задач (WAI-ARIA Treeview) |
| <kbd>Alt</kbd> + Клик | Сайдбар | Свернуть / развернуть все папки текущего раздела |
| <kbd>Esc</kbd> | Глобально | Закрыть модальное окно, подсказку или палитру поиска |

---

## 📜 История версий

Полная история изменений доступна в файле **[CHANGELOG.md](CHANGELOG.md)**.

- **[v2.3.4](CHANGELOG.md#v2-3-4)** — Реструктуризация JavaScript-каталога под собеседования, 15 новых задач по объектам, умный интервальный помощник с мотивацией, Gauge-индикатор вероятности на интервью (BigTech, FinTech, E-commerce), исключение задач из повторения.
- **[v2.3.3](CHANGELOG.md#v2-3-3)** — Асинхронный кэш реестра задач по разделам, мгновенный переход в полноэкранный редактор без промежуточных лоадеров, скелетоны страниц и сайдбара.
- **[v2.3.2](CHANGELOG.md#v2-3-2)** — Раздел «Избранное» со структурированным деревом и фильтрами, оптимизация сборки (route-level code splitting в Vite), сброс настроек UI.
- **[v2.3.1](CHANGELOG.md#v2-3-1)** — Полноэкранный двухпанельный сплит-режим «Код + Интерфейс» (70/30), JsConsole, автотранспиляция и виртуальный React-рантайм в Web Worker.
- **[v2.3.0](CHANGELOG.md#v2-3-0)** — Архитектура Feature-Sliced Design v2.1, React 19, TypeScript 7 Strict, Vite 8 Rolldown, TanStack Router, изолированная песочница и алгоритм SM-2.

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
