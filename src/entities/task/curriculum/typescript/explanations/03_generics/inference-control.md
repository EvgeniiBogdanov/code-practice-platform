# Разбор задачи: «Управление выводом типов»

## 1. Что дано

Две функции, у которых вывод типов по умолчанию даёт не то, что нужно:

- `createMachine` должна понять, какие состояния есть, из массива `states` и проверить по ним `initial`;
- `defineConfig` должна сохранить точные значения объекта, а не расширить их до `string` и `number`.

Задача про три инструмента: ограничение примитивом, `NoInfer` и `const`-параметр типа.

## 2. Что нужно получить

| Вызов | Ожидание |
| --- | --- |
| `createMachine(["idle", "loading"], "idle")` | `S = "idle" \| "loading"` |
| `createMachine(["idle", "loading"], "idel")` | ошибка |
| `machine.transition("done")` | ошибка |
| `defineConfig({ mode: "dark", retries: 3 })` | `{ readonly mode: "dark"; readonly retries: 3 }` |

## 3. Шаг 1. Ограничение string сохраняет литералы

```ts
const f = <S>(states: S[]) => states;
f(["idle", "loading"]); // S = string

const g = <S extends string>(states: S[]) => states;
g(["idle", "loading"]); // S = "idle" | "loading"
```

Если ограничение параметра типа — примитив (`string`, `number`, `boolean`), TypeScript считает, что важны точные значения, и не расширяет литералы. Это первое правило управления выводом.

## 4. Шаг 2. NoInfer запрещает «голосовать» за тип

Попробуем без `NoInfer`:

```ts
const createMachine = <S extends string>(states: readonly S[], initial: S) => ...;
createMachine(["idle", "loading"], "idel"); // ошибки нет
```

`S` выводится из **всех** позиций, где он встречается. Кандидаты: `"idle"`, `"loading"` из массива и `"idel"` из второго аргумента. Результат — `"idle" | "loading" | "idel"`, и опечатка стала состоянием.

`NoInfer<S>` (TypeScript 5.4) убирает позицию из вывода: `S` выводится только из `states`, а `initial` лишь проверяется на совместимость с ним.

```ts
const createMachine = <S extends string>(
  states: readonly S[],
  initial: NoInfer<S>
): Machine<S> => { ... };
```

## 5. Шаг 3. const-параметр типа

```ts
const defineConfig = <T extends object>(config: T): T => config;
defineConfig({ mode: "dark", retries: 3 }); // { mode: string; retries: number }
```

Поля объекта изменяемы, поэтому их типы расширяются. Модификатор `const` (TypeScript 5.0) выводит тип аргумента так, будто вызывающий написал `as const`:

```ts
const defineConfig = <const T extends object>(config: T): T => config;
defineConfig({ mode: "dark", retries: 3 }); // { readonly mode: "dark"; readonly retries: 3 }
```

Так устроены `defineConfig` в Vite и подобные функции библиотек: пользователь пишет обычный объект, а библиотека получает точные типы.

## 6. Полный код

```ts
interface Machine<S extends string> {
  getState: () => S;
  transition: (next: S) => void;
}

const createMachine = <S extends string>(
  states: readonly S[],
  initial: NoInfer<S>
): Machine<S> => {
  let current = initial;

  return {
    getState: () => current,
    transition: (next) => {
      if (states.includes(next)) {
        current = next;
      }
    },
  };
};

const defineConfig = <const T extends object>(config: T): T => config;
```

`readonly S[]` в параметре нужен, чтобы функция принимала и `readonly`-массивы, а `states.includes(next)` компилируется, потому что `next` уже имеет тип `S`.

## 7. Как это делали до TypeScript 5.4

```ts
const createMachine = <S extends string, I extends S>(states: readonly S[], initial: I) => ...;
```

Второй параметр `I` выводится отдельно и обязан быть подтипом `S`. Работает, но добавляет лишний параметр типа. Был и трюк с отложенным выводом: `initial: [S][S extends any ? 0 : never]`. `NoInfer` делает то же самое явно и читаемо.

## 8. Частые ошибки

- Требовать от пользователя `as const` на каждом вызове вместо `const`-параметра.
- Использовать `const T extends unknown[]` с изменяемым массивом в ограничении: `const`-вывод даёт `readonly`-кортеж, который не подходит к изменяемому массиву, и TypeScript откатывается к обычному выводу. Ограничение должно быть `readonly unknown[]`.
- Не замечать, что лишняя позиция параметра типа расширяет его, как `initial` в примере без `NoInfer`.

## 9. Что запомнить

Вывод типов можно направлять: ограничение-примитив сохраняет литералы, `NoInfer` выбирает, из каких аргументов выводить, а `const` даёт эффект `as const` без участия вызывающего кода.
