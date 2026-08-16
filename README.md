<div align="center">

# ⚡ Code Practice Platform · `v2.2.2`

### Интерактивная платформа для подготовки к техническим собеседованиям по фронтенду и алгоритмам.

<br />

<img width="1723" height="881" alt="v2-2-1" src="https://github.com/user-attachments/assets/3c3c866a-dda5-4911-8bc0-2bc8497373d4" />

**Code Practice Platform** — это полноценная среда для эффективной подготовки к техническим интервью по **JavaScript**, **React** и **Алгоритмам** (от Junior до Senior). Платформа сочетает интерактивный редактор в браузере, песочницу выполнения кода, систему интервального повторения и базу из более чем **280 задач** с реальных собеседований с эталонными решениями и разбором антипаттернов.

<br />

[![Онлайн-версия](https://img.shields.io/badge/Открыть_в_браузере-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://evgeniibogdanov.github.io/code-practice-platform/)

<br />

[![GitHub Stars](https://img.shields.io/github/stars/EvgeniiBogdanov/code-practice-platform?style=flat-square&label=Stars&color=yellow&logo=github)](https://github.com/EvgeniiBogdanov/code-practice-platform/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/EvgeniiBogdanov/code-practice-platform?style=flat-square&label=Forks&color=blue&logo=github)](https://github.com/EvgeniiBogdanov/code-practice-platform/network/members)
[![License](https://img.shields.io/github/license/EvgeniiBogdanov/code-practice-platform?style=flat-square&color=green)](LICENSE.md)
[![Last Commit](https://img.shields.io/github/last-commit/EvgeniiBogdanov/code-practice-platform?style=flat-square&color=blue)](https://github.com/EvgeniiBogdanov/code-practice-platform/commits/main)
[![Language](https://img.shields.io/github/languages/top/EvgeniiBogdanov/code-practice-platform?style=flat-square&color=yellow&logo=javascript)](https://github.com/EvgeniiBogdanov/code-practice-platform)

</div>

---

> 🌐 **Быстрый доступ:**
>
> - **[🚀 Открыть онлайн-версию](https://evgeniibogdanov.github.io/code-practice-platform/)** — _Практика прямо в браузере без установки._
> - **[📥 Локальный запуск](#-пошаговая-установка-и-запуск)** — _Для локальной разработки и практики в связке с IDE._

---

## ✨ Ключевые возможности

<table>
  <tr>
    <td colspan="2" valign="top">
      <h3>🧠 Умное интервальное повторение (SM-2)</h3>
      <p>Адаптированный алгоритм интервалов (<code>1д</code> ➔ <code>3д</code> ➔ <code>7д</code> ➔ <code>14д</code> ➔ <code>30д</code> ➔ <code>60+д</code> / Мастер). Оценка сложности решения, персональный график повторений, дашборд прогресса и быстрый доступ к дедлайнам из шапки.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>⚛️ React Live Runner & Живое Превью</h3>
      <p>Мгновенная транспиляция JSX/TSX через <code>sucrase</code> (<1ms). Поддержка всех хуков React, Redux Toolkit, Zustand, изоляция таймеров и защита от бесконечных циклов.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🎯 280+ задач с реальных собеседований</h3>
      <p>Подробные разборы кода кандидатов, поиск багов, эталонные решения с оценкой сложности <code>O(N)</code> / <code>O(1)</code>, интерактивные чеклисты критериев и вопросы интервьюера.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>💻 VS Code-Level редактор и IntelliSense</h3>
      <p>Автодополнение методов и хуков, всплывающие Hover Tooltips с типами TypeScript, Emmet JSX-генератор, быстрый поиск файлов (<code>Cmd+P</code>) и переход к строке (<code>Cmd+G</code>).</p>
    </td>
    <td width="50%" valign="top">
      <h3>💾 Zero-Lag Dual Storage & Sync</h3>
      <p>Двухуровневое хранилище (L1 LocalStorage кэш 0 мс + L2 IndexedDB v3) без лимитов памяти и мгновенная межвкладочная синхронизация через <code>BroadcastChannel API</code>.</p>
    </td>
  </tr>
  <tr>
    <td colspan="2" valign="top">
      <h3>⚡ Интерактивная консоль xterm.js</h3>
      <p>Запуск кода через изолированный <b>Web Worker</b>, точный замер времени исполнения в миллисекундах (<code>⚡ 4.2ms</code>) и контрастная палитра для светлой и тёмной тем.</p>
    </td>
  </tr>
</table>

---

## 🛠️ Технологический стек

<p align="center">
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Zustand_5-443e38?style=for-the-badge&logo=react&logoColor=white" alt="Zustand 5" />
  <img src="https://img.shields.io/badge/TanStack_Router-FF4154?style=for-the-badge&logo=react&logoColor=white" alt="TanStack Router" />
  <img src="https://img.shields.io/badge/IndexedDB_v3-336791?style=for-the-badge&logo=sqlite&logoColor=white" alt="IndexedDB" />
  <img src="https://img.shields.io/badge/Web_Workers-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Web Workers" />
  <img src="https://img.shields.io/badge/xterm.js-000000?style=for-the-badge&logo=gnubash&logoColor=white" alt="xterm.js" />
  <img src="https://img.shields.io/badge/Sucrase-FF5722?style=for-the-badge&logo=babel&logoColor=white" alt="Sucrase" />
  <img src="https://img.shields.io/badge/Lucide_Icons-F56565?style=for-the-badge&logo=feather&logoColor=white" alt="Lucide Icons" />
</p>

---

## 📜 История версий

Полная история всех изменений и релизов доступна в файле **[CHANGELOG.md](CHANGELOG.md)**.

- **[v2.2.2](CHANGELOG.md#v2-2-2)** — Календарный SM-2 с учетом таймзоны, автосброс решений в день повтора, унификация меню и UI полировка.
- **[v2.2.1](CHANGELOG.md#v2-2-1)** — Умное интервальное повторение (SM-2), кастомная система Tooltip (Radix-like), редизайн Header и карточек задач.
- **[v2.2.0](CHANGELOG.md#v2-2-0)** — React Live Runner, TypeScript Live Type Checking, Hover Tooltips с сигнатурами, Emmet JSX & навигация.
- **[v2.1.8](CHANGELOG.md#v2-1-8)** — Хранилище IndexedDB, Web Worker sandbox, оптимизация размера главного бандла на 85.5%.
- **[v2.0.0](CHANGELOG.md#v2-0-0)** — Запуск браузерного редактора кода и интерактивной терминальной консоли.

---

## 📥 Пошаговая установка и запуск

Для локального запуска выполните следующие команды:

```bash
# 1. Клонирование репозитория
git clone https://github.com/EvgeniiBogdanov/code-practice-platform.git
cd code-practice-platform

# 2. Установка зависимостей
npm install

# 3. Запуск сервера разработки
npm run dev
```

Приложение будет доступно по адресу `http://localhost:4000/`.

---

## ⌨️ Горячие клавиши (Hotkeys)

| Сочетание клавиш                                                     | Действие                                                      |
| :------------------------------------------------------------------- | :------------------------------------------------------------ |
| <kbd>⌘</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd>         | Палитра быстрого поиска задач по всем разделам                |
| <kbd>⌘</kbd> + <kbd>P</kbd> / <kbd>Ctrl</kbd> + <kbd>P</kbd>         | Быстрое переключение файлов многофайловой задачи (Quick Open) |
| <kbd>⌘</kbd> + <kbd>G</kbd> / <kbd>Ctrl</kbd> + <kbd>G</kbd>         | Переход к заданной строке и колонке кода                      |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> / <kbd>⌘</kbd> + <kbd>Enter</kbd> | Запуск выполнения кода в консоли / песочнице                  |
| <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd>                     | Форматирование кода через Prettier                            |
| <kbd>Alt</kbd> + <kbd>↑</kbd> / <kbd>↓</kbd>                         | Перемещение текущей строки вверх / вниз                       |
| <kbd>Esc</kbd>                                                       | Закрыть модальное окно / меню поиска                          |

---

## 📂 Структура проекта

```text
src/
├── algorithms/        # Задачи, код, тесты и разборы по алгоритмам
├── components/        # UI-компоненты (Header, Sidebar, дашборд, Tooltip, консоль, редактор)
├── data/              # Реестр задач (tasksRegistry) и интерактивные шпаргалки
├── hooks/             # Кастомные хуки (таймер, горячие клавиши)
├── javascript/        # Задачи, код, тесты и разборы по JavaScript
├── react/             # Live-компоненты, редюсеры и задачи по React
├── routes/            # Файловая маршрутизация на базе TanStack Router
├── services/          # Сервисы хранения IndexedDB, LocalStorage кэш, BroadcastChannel
├── stores/            # Хранилища состояния Zustand (UI, Progress, Review, Timer)
├── utils/             # Алгоритм SM-2, Web Worker runner, линтеры и сниппеты
└── playground.css     # Дизайн-система, CSS-токены и адаптивные стили
```

---

## 🤝 Вклад в проект (Contributing)

Мы приветствуем любые идеи, улучшения и исправления!

1. Сделайте **Fork** репозитория.
2. Создайте тематическую ветку: `git checkout -b feature/amazing-feature`.
3. Зафиксируйте изменения: `git commit -m "feat: add some amazing feature"`.
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
