<div align="center">

# <img src="public/favicon.svg" width="32" height="32" alt="Code Practice Platform" align="center" /> Code Practice Platform · `v2.2.96`

### Интерактивная платформа для подготовки к техническим собеседованиям по фронтенду и алгоритмам

<br />

<img width="1723" height="881" alt="Code Practice Platform Preview" src="https://github.com/user-attachments/assets/3c3c866a-dda5-4911-8bc0-2bc8497373d4" />

<br />

[![Онлайн-версия](https://img.shields.io/badge/Открыть_в_браузере-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://code-practice-platform-omega.vercel.app/home)

<br />

[![GitHub Stars](https://img.shields.io/github/stars/EvgeniiBogdanov/code-practice-platform?style=flat-square&label=Stars&color=yellow&logo=github)](https://github.com/EvgeniiBogdanov/code-practice-platform/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/EvgeniiBogdanov/code-practice-platform?style=flat-square&label=Forks&color=blue&logo=github)](https://github.com/EvgeniiBogdanov/code-practice-platform/network/members)
[![License](https://img.shields.io/github/license/EvgeniiBogdanov/code-practice-platform?style=flat-square&color=green)](LICENSE.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_7.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](tsconfig.json)
[![FSD](https://img.shields.io/badge/Architecture-FSD_v2.1-blue?style=flat-square)](https://feature-sliced.design)

</div>

---

> 🌐 **Быстрый доступ:**
>
> - **[🚀 Открыть онлайн-версию](https://code-practice-platform-omega.vercel.app/home)** — _Практика прямо в браузере без установки._
> - **[📥 Локальный запуск](#-установка-и-запуск)** — _Для локальной разработки и практики._

---

## ✨ Ключевые возможности

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🎯 300+ задач с реальных интервью</h3>
      <p>База задач по <b>React + TypeScript</b>, <b>JavaScript</b> (от замыканий до Event Loop и промисов) и <b>Алгоритмам</b>. Эталонные решения с оценкой <code>O(N)</code> / <code>O(1)</code>, поиск багов и чеклисты самопроверки.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🧠 Интервальное повторение (SM-2)</h3>
      <p>Адаптированный алгоритм интервального запоминания (<code>1д</code> ➔ <code>3д</code> ➔ <code>7д</code> ➔ <code>14д</code> ➔ <code>30д</code> ➔ <code>60+д</code> / Мастер) с учетом таймзон, автоматическим сбросом решений в день повтора и шкалой мастерства.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>⚛️ React Live Runner & Node.js Sandbox</h3>
      <p>Изолированная <code>iframe</code>-песочница с перехватом рантайм-ошибок для React/TSX на <b>Sucrase</b> и Web Worker для мгновенного исполнения JavaScript/Node.js с терминалом <b>xterm.js</b> и замером времени выполнения (<code>⚡ 4.2ms</code>).</p>
    </td>
    <td width="50%" valign="top">
      <h3>💻 Самописный легковесный онлайн редактор кода</h3>
      <p>Собственный быстрый редактор без нагрузки на бандл приложения. Мультикурсоры (<code>Cmd+D</code> / <code>Cmd+Shift+L</code>), перемещение строк (<code>Alt+↑/↓</code>), контекстный IntelliSense по расширениям файлов (JS, TSX, CSS, HTML), встроенное форматирование <b>Prettier 3</b> (<code>Shift+Alt+F</code>), всплывающие подсказки сигнатур типов TypeScript, Emmet и линтинг.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>📊 Аналитика и визуализация прогресса</h3>
      <p>Интерактивные графики на <b>Visx 4</b>, кольцевые диаграммы освоения разделов, статистика решений по категориям сложности и детальный трекинг подготовки.</p>
    </td>
    <td width="50%" valign="top">
      <h3>💾 Zero-Lag Dual Storage & Sync</h3>
      <p>Двухуровневое хранилище (L1 LocalStorage кэш 0 мс + L2 IndexedDB v3) с автосохранением решений и межвкладочной синхронизацией в реальном времени через <code>BroadcastChannel API</code>.</p>
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
  <img src="https://img.shields.io/badge/Sucrase_3-F59E0B?style=for-the-badge&logo=babel&logoColor=white" alt="Sucrase 3" />
  <img src="https://img.shields.io/badge/IndexedDB_v3-336791?style=for-the-badge&logo=sqlite&logoColor=white" alt="IndexedDB" />
  <img src="https://img.shields.io/badge/Web_Workers-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Web Workers" />
  <img src="https://img.shields.io/badge/CSS_Modules-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS Modules" />
  <img src="https://img.shields.io/badge/clsx_2-22C55E?style=for-the-badge&logo=react&logoColor=white" alt="clsx 2" />
</p>

| Категория                                                                  | Технологии и библиотеки                                                                                                                |
| :------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend Core**                                                          | **React 19.2** (`react`, `react-dom`), **TypeScript 7.0**, **Vite 8** (движок Rolldown)                                                |
| **Архитектура & Роутинг**                                                  | **Feature-Sliced Design (FSD v2.1)**, **TanStack Router** (типобезопасная файловая маршрутизация)                                      |
| **Управление состоянием**                                                  | **Zustand 5** (стейт приложения и UI), **Redux Toolkit 2** & **React-Redux** (рантайм песочницы для решения задач по Redux)            |
| **Исполнение кода & Sandbox**                                              | **Sucrase** (мгновенный JSX/TSX транспайлер), **xterm.js 6** (интерактивный терминал), **Web Workers**, изолированный `iframe` Sandbox |
| **Аналитика & Графики**                                                    | **Visx 4** (`@visx/shape`, `@visx/scale`, `@visx/grid`, `@visx/tooltip`, `@visx/curve` и др.)                                          |
| **Хр## ⌨️ Управление с клавиатуры и горячие клавиши (Hotkeys & Navigation) |

### ⚡️ Навигация по дереву сайдбара (WAI-ARIA Treeview)

| Клавиша / Сочетание                              | Действие                                                               |
| :----------------------------------------------- | :--------------------------------------------------------------------- |
| <kbd>↓</kbd> / <kbd>↑</kbd>                      | Перемещение фокуса между видимыми строками дерева (папками и задачами) |
| <kbd>→</kbd>                                     | Раскрыть свернутую папку / перейти к первой дочерней задаче            |
| <kbd>←</kbd>                                     | Свернуть открытую папку / перейти к родительской теме                  |
| <kbd>Enter</kbd> / <kbd>Space</kbd>              | Открыть выбранную задачу / переключить состояние папки                 |
| <kbd>Home</kbd> / <kbd>End</kbd>                 | Быстрый переход к первой / последней строке дерева                     |
| <kbd>Alt</kbd> + Клик / <kbd>Option</kbd> + Клик | Массовое сворачивание / разворачивание всех папок раздела              |

### 💻 Редактор кода: Мультикурсоры и манипуляции со строками (VS Code Style)

| Сочетание клавиш (macOS)                                           | Сочетание клавиш (Win / Linux)                                  | Действие                                                              |
| :----------------------------------------------------------------- | :-------------------------------------------------------------- | :-------------------------------------------------------------------- |
| <kbd>⌘</kbd> + <kbd>D</kbd>                                        | <kbd>Ctrl</kbd> + <kbd>D</kbd>                                  | Выделить слово / найти и добавить следующее совпадение (мультикурсор) |
| <kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd>                     | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd>               | Выделить все совпадения выделенного слова в документе                 |
| <kbd>Option</kbd> + <kbd>↑</kbd> / <kbd>↓</kbd>                    | <kbd>Alt</kbd> + <kbd>↑</kbd> / <kbd>↓</kbd>                    | Переместить текущую строку или выделенный блок строк вверх / вниз     |
| <kbd>Shift</kbd> + <kbd>Option</kbd> + <kbd>↑</kbd> / <kbd>↓</kbd> | <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>↑</kbd> / <kbd>↓</kbd> | Продублировать текущую строку или выделенный блок строк вверх / вниз  |
| <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd>                   | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>L</kbd>                 | Форматирование кода через Prettier 3                                  |
| <kbd>⌘</kbd> + <kbd>F</kbd>                                        | <kbd>Ctrl</kbd> + <kbd>F</kbd>                                  | Панель быстрого поиска и замены в редакторе                           |
| <kbd>Alt</kbd> + <kbd>Z</kbd>                                      | <kbd>Alt</kbd> + <kbd>Z</kbd>                                   | Переключение мягкого переноса строк (Word Wrap)                       |
| <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd>                 | <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd>              | Добавить отступ (2 пробела) / убрать отступ для выделенных строк      |
| <kbd>⌘</kbd> + <kbd>/</kbd>                                        | <kbd>Ctrl</kbd> + <kbd>/</kbd>                                  | Закомментировать / раскомментировать строку (`//`)                    |
| <kbd>Esc</kbd> / Клик мыши                                         | <kbd>Esc</kbd> / Клик мыши                                      | Сброс мультикурсоров / закрытие окна подсказок                        |

### 🧠 Интеллектуальное автодополнение (IntelliSense & Snippets)

| Сочетание клавиш                   | Действие                                                                            |
| :--------------------------------- | :---------------------------------------------------------------------------------- |
| <kbd>Ctrl</kbd> + <kbd>Space</kbd> | Принудительный вызов контекстного меню подсказок IntelliSense                       |
| <kbd>↓</kbd> / <kbd>↑</kbd>        | Навигация по списку предложенных ключевых слов, методов и сниппетов                 |
| <kbd>Tab</kbd> / <kbd>Enter</kbd>  | Принять выбранную подсказку или развернуть сниппет (например, `clg` → `console.log( | )`) |
| <kbd>Esc</kbd>                     | Закрыть меню автодополнения без вставки текста                                      |

### ⚡ Рабочее пространство и глобальные шорткаты

| Сочетание клавиш                                                     | Действие                                                                |
| :------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| <kbd>⌘</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd>         | Палитра быстрого поиска задач по всем разделам платформы                |
| <kbd>⌘</kbd> + <kbd>Enter</kbd> / <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Запуск кода в терминале Node.js / песочнице React Live Runner           |
| <kbd>F11</kbd>                                                       | Полноэкранный режим редактора кода                                      |
| <kbd>Esc</kbd>                                                       | Закрыть активное модальное окно, подсказку (Tooltip) или палитру поиска |

---

## 📜 История версий

Полная история всех изменений доступна в файле **[CHANGELOG.md](CHANGELOG.md)**.

- **[v2.2.95](CHANGELOG.md#v2-2-95)** — Контекстный IntelliSense для JS/TS/React, мультикурсоры (Cmd+D), перемещение строк (Alt+↑/↓), умное управление консолью, редизайн модалок.
- **[v2.2.9](CHANGELOG.md#v2-2-9)** — WAI-ARIA Treeview навигация по сайдбару, оптимизация CSS Grid анимаций, NotificationBadge, Sticky Progress.
- **[v2.2.8](CHANGELOG.md#v2-2-8)** — Полная миграция на FSD v2.1, Strict TypeScript, посадочные страницы разделов, Prettier 3 Formatter, теория React+TS.
- **[v2.2.7](CHANGELOG.md#v2-2-7)** — Архитектурная изоляция песочницы React (`iframe`), автоподстройка высоты, нормализация Form Controls.
- **[v2.2.2](CHANGELOG.md#v2-2-2)** — Календарный SM-2 с учетом таймзоны, автосброс решений в день повтора.
- **[v2.2.1](CHANGELOG.md#v2-2-1)** — Умное интервальное повторение (SM-2), Radix-подобная система Tooltip, редизайн Header.�емещение фокуса между видимыми строками дерева (папками и задачами) |
  | <kbd>→</kbd> | Раскрыть свернутую папку / перейти к первой дочерней задаче |
  | <kbd>←</kbd> | Свернуть открытую папку / перейти к родительской теме |
  | <kbd>Enter</kbd> / <kbd>Space</kbd> | Открыть выбранную задачу / переключить состояние папки |
  | <kbd>Home</kbd> / <kbd>End</kbd> | Быстрый переход к первой / последней строке дерева |
  | <kbd>Alt</kbd> + Клик / <kbd>Option</kbd> + Клик | Массовое сворачивание / разворачивание всех папок раздела |

### 💻 Редактор кода и рабочее пространство

| Сочетание клавиш                                                                                   | Действие                                                                |
| :------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| <kbd>⌘</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd>                                       | Палитра быстрого поиска задач по всем разделам                          |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> / <kbd>⌘</kbd> + <kbd>Enter</kbd>                               | Запуск выполнения кода в консоли / песочнице                            |
| <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd> / <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>L</kbd> | Форматирование кода через Prettier 3                                    |
| <kbd>⌘</kbd> + <kbd>F</kbd> / <kbd>Ctrl</kbd> + <kbd>F</kbd>                                       | Поиск и замена в редакторе кода                                         |
| <kbd>Alt</kbd> + <kbd>Z</kbd>                                                                      | Переключение переноса строк (Word Wrap)                                 |
| <kbd>F11</kbd>                                                                                     | Полноэкранный режим редактора кода                                      |
| <kbd>Esc</kbd>                                                                                     | Закрыть активное модальное окно, подсказку (Tooltip) или палитру поиска |

---

## 📜 История версий

Полная история всех изменений доступна в файле **[CHANGELOG.md](CHANGELOG.md)**.

- **[v2.2.9](CHANGELOG.md#v2-2-9)** — WAI-ARIA Treeview навигация по сайдбару, оптимизация CSS Grid анимаций, NotificationBadge, Sticky Progress.
- **[v2.2.8](CHANGELOG.md#v2-2-8)** — Полная миграция на FSD v2.1, Strict TypeScript, посадочные страницы разделов, Prettier 3 Formatter, теория React+TS.
- **[v2.2.7](CHANGELOG.md#v2-2-7)** — Архитектурная изоляция песочницы React (`iframe`), автоподстройка высоты, нормализация Form Controls.
- **[v2.2.2](CHANGELOG.md#v2-2-2)** — Календарный SM-2 с учетом таймзоны, автосброс решений в день повтора.
- **[v2.2.1](CHANGELOG.md#v2-2-1)** — Умное интервальное повторение (SM-2), Radix-подобная система Tooltip, редизайн Header.

---

## 🤝 Вклад в проект (Contributing)

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

## 👤 Автор

**Евгений Богданов** — [GitHub профиль](https://github.com/EvgeniiBogdanov)

<div align="center">
  <br />
  Если платформа помогла вам в подготовке — поддержите проект ⭐ <b>звёздочкой на GitHub</b>!
  <br /><br />
</div>
