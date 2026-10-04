# Разбор задачи: «Функции-утверждения»

## 1. Что дано

Две функции-проверки бросают исключение при неверных данных. Но после их вызова TypeScript по-прежнему считает, что `url` может быть `undefined`, а `value` — `unknown`. Компилятор не знает, что функция проверки прерывает выполнение при неудаче.

## 2. Что нужно получить

После строки `assert(url !== undefined, ...)` тип `url` — `string`. После `assertIsString(value)` тип `value` — `string`. Без `if` и без `as`.

## 3. Две формы asserts

| Сигнатура | Что сообщает компилятору |
| --- | --- |
| `asserts condition` | если функция вернула управление, условие истинно |
| `asserts value is T` | если функция вернула управление, `value` имеет тип `T` |

Это отличается от предиката `value is T`: предикат возвращает `boolean` и сужает тип только внутри `if`, а функция-утверждение либо бросает исключение, либо сужает тип **во всём последующем коде**.

## 4. Решение по шагам

### Шаг 1. assert с произвольным условием

```ts
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
```

После `assert(url !== undefined, ...)` TypeScript применяет к остальному коду то же сужение, что и после `if (url !== undefined)`.

### Шаг 2. assertIsString с конкретным типом

```ts
function assertIsString(value: unknown): asserts value is string { ... }
```

### Шаг 3. Объявить функции правильно

Если оставить стрелки и добавить типы прямо в них:

```ts
const assert = (condition: unknown, message: string): asserts condition => { ... };
```

вызов `assert(...)` выдаст ошибку TS2775: *Assertions require every name in the call target to be declared with an explicit type annotation*. Анализ потока управления строится до полного вывода типов и не может вычислять тип инициализатора константы. Поэтому имя должно иметь явный тип:

```ts
function assert(condition: unknown, message: string): asserts condition { ... }
// или
const assert: (condition: unknown, message: string) => asserts condition = (condition, message) => { ... };
```

### Полный код

```ts
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Ожидалась строка");
  }
}

const getApiUrl = (env: Record<string, string | undefined>): string => {
  const url = env.API_URL;
  assert(url !== undefined, "Переменная API_URL не задана");
  return url.toLowerCase();
};

const shout = (value: unknown): string => {
  assertIsString(value);
  return value.toUpperCase();
};
```

## 5. То же правило для never

Функция, возвращающая `never`, тоже прерывает поток управления только при явном типе имени. Это одно и то же ограничение: TypeScript должен узнать о «невозвратности» вызова, не вычисляя типы выражений.

## 6. Где это используется

- `assert` из `node:assert` объявлен с `asserts value`;
- `invariant(condition, message)` в React и многих библиотеках;
- проверка переменных окружения при старте приложения;
- методы `parse` в библиотеках схем бросают ошибку и возвращают проверенное значение.

## 7. Частые ошибки

- Ожидать, что `asserts` что-то проверит сам. Это только обещание: если тело функции не бросает исключение при неверных данных, сужение будет ложным.
- Возвращать значение из функции-утверждения. Её тип результата — только `asserts ...`.
- Вызывать утверждение как часть выражения (`const x = assert(...)`). Сужение работает для вызова отдельной инструкцией.

## 8. Что запомнить

`asserts condition` и `asserts value is T` превращают функцию-проверку в точку, после которой тип сужен до конца блока. Объявляйте такие функции через `function` или с явным типом константы.
