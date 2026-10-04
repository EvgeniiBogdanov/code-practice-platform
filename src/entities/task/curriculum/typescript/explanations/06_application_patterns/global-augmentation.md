# Разбор задачи: «Расширение глобальных типов»

## 1. Что дано

Внешние скрипты добавляют поля в глобальный объект `window`. TypeScript о них не знает: `Property 'analytics' does not exist on type 'Window & typeof globalThis'`. Самый быстрый «фикс» — `(window as any).analytics` — отключает проверку и повторяется в каждом месте использования.

## 2. Что нужно получить

Один раз описать новые поля так, чтобы во всём проекте `window.analytics.track(...)` и `window.__INITIAL_STATE__` проверялись компилятором.

## 3. Слияние объявлений

`Window` в стандартной библиотеке объявлен как **интерфейс**. Интерфейсы с одинаковым именем в одной области видимости сливаются. Значит, достаточно объявить ещё один `interface Window` с нужными полями — но в **глобальной** области.

## 4. Решение по шагам

### Шаг 1. Описать данные отдельными интерфейсами

```ts
interface Analytics {
  track(event: string, payload?: Record<string, unknown>): void;
}

interface InitialState {
  userId: string;
  featureFlags: string[];
}
```

### Шаг 2. Выйти в глобальную область

Файл содержит `export {}`, значит, это **модуль**: всё, что в нём объявлено, локально. `interface Window` внутри модуля создал бы новый локальный тип, не связанный с глобальным. Для расширения глобального типа из модуля нужен блок `declare global`:

```ts
declare global {
  interface Window {
    analytics: Analytics;
    __INITIAL_STATE__: InitialState;
  }
}
```

Интерфейсы `Analytics` и `InitialState` можно использовать внутри блока, хотя они объявлены в модуле.

### Полный код

```ts
export {};

interface Analytics {
  track(event: string, payload?: Record<string, unknown>): void;
}

interface InitialState {
  userId: string;
  featureFlags: string[];
}

declare global {
  interface Window {
    analytics: Analytics;
    __INITIAL_STATE__: InitialState;
  }
}

window.analytics.track("page_view", { path: location.pathname });
const flags = window.__INITIAL_STATE__.featureFlags;
```

## 5. Где это живёт в реальном проекте

Обычно такие объявления выносят в отдельный файл, например `src/types/global.d.ts`, и он подхватывается через `include` в `tsconfig.json`. Файл `.d.ts` содержит только объявления, без кода.

Похожие задачи:

| Задача | Что расширяется |
| --- | --- |
| переменные окружения Vite | `interface ImportMetaEnv` в `vite-env.d.ts` |
| пользователь в Express | `declare module "express-serve-static-core" { interface Request { user?: User } }` |
| тема в styled-components | `declare module "styled-components" { interface DefaultTheme {...} }` |
| импорт `.svg` или `.css` | `declare module "*.svg" { const src: string; export default src; }` |

Расширение типов модуля (module augmentation) работает так же, как `declare global`, только целью является экспортируемый интерфейс конкретного пакета.

## 6. Насколько честны эти типы

`declare` ничего не создаёт — он описывает то, что уже существует. Если скрипт аналитики заблокирован расширением браузера, `window.analytics` окажется `undefined`, а тип скажет обратное. Для полей, наличие которых не гарантировано, честнее сделать их необязательными (`analytics?: Analytics`) и вызывать через `window.analytics?.track(...)`.

## 7. Частые ошибки

- Объявлять `interface Window` в модуле без `declare global` и не понимать, почему поля не появились.
- Использовать `declare global` в файле без `import`/`export`: TypeScript сообщит, что аугментации глобальной области допустимы только в модулях.
- Описывать новые поля через `type Window = ...`: псевдонимы не сливаются.
- Приводить `window as any` в каждом месте использования.

## 8. Что запомнить

Глобальные и библиотечные типы расширяются слиянием интерфейсов. В модуле для этого нужен `declare global` или `declare module "имя"`. Описывайте поля так, как они действительно существуют во время выполнения.
