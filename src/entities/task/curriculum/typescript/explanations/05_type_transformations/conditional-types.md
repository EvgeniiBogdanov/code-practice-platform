# Разбор задачи: «Условные типы»

## 1. Что дано

Нужно написать три типа, которые выбирают результат в зависимости от входного типа. Это первый шаг к вычислениям на уровне типов: здесь ещё нет `infer`, только проверка и выбор ветки.

## 2. Что нужно получить

| Вход | Результат |
| --- | --- |
| `IsString<"hello">` | `true` |
| `IsString<42>` | `false` |
| `MyNonNullable<string \| null>` | `string` |
| `TypeName<() => void>` | `"function"` |
| `TypeName<string[]>` | `"object"` |

## 3. Синтаксис условного типа

```ts
T extends U ? X : Y
```

Читается как тернарный оператор: «если `T` совместим с `U`, то `X`, иначе `Y`». `extends` здесь означает не наследование, а **присваиваемость**: можно ли значение типа `T` положить в переменную типа `U`.

- `"hello" extends string` — истина: литерал является строкой;
- `string extends "hello"` — ложь: не каждая строка равна `"hello"`.

## 4. Решение по шагам

### IsString

```ts
type IsString<T> = T extends string ? true : false;
```

Результат — литеральные типы `true` и `false`, а не значения.

### MyNonNullable

```ts
type MyNonNullable<T> = T extends null | undefined ? never : T;
```

Работает за счёт **распределения**: для `string | null` условие применяется к каждому варианту отдельно. `string` → `string`, `null` → `never`. Объединение `string | never` — это `string`, потому что `never` в объединении исчезает.

### TypeName — цепочка условий

```ts
type TypeName<T> = T extends string
  ? "string"
  : T extends number
    ? "number"
    : T extends boolean
      ? "boolean"
      : T extends (...args: never[]) => unknown
        ? "function"
        : "object";
```

Ветки проверяются по порядку, выбирается первая подходящая.

Почему функция описана как `(...args: never[]) => unknown`? Это тип, которому соответствует **любая** функция. Параметры функций сравниваются в обратную сторону (контравариантно): функция `(x: string) => void` подходит к типу с аргументами `never[]`, потому что `never` можно передать куда угодно. С `unknown[]` она бы не подошла: функция, ожидающая строку, не умеет принимать «что угодно».

### Полный код

```ts
type IsString<T> = T extends string ? true : false;

type MyNonNullable<T> = T extends null | undefined ? never : T;

type TypeName<T> = T extends string
  ? "string"
  : T extends number
    ? "number"
    : T extends boolean
      ? "boolean"
      : T extends (...args: never[]) => unknown
        ? "function"
        : "object";
```

## 5. Распределение по объединению

Если слева от `extends` стоит голый параметр типа, а в него передано объединение, условный тип применяется к каждому варианту:

```ts
IsString<string | number>
// = IsString<string> | IsString<number>
// = true | false
// = boolean
```

```ts
TypeName<string | number> // "string" | "number"
```

Именно так работают встроенные `Exclude`, `Extract` и `NonNullable` в старой реализации. Как отключить распределение — в отдельной задаче.

## 6. Частые ошибки

- Читать `extends` как «наследует». Это проверка присваиваемости.
- Ставить проверку `object` раньше функции: функции и массивы — тоже объекты, ветка `"function"` никогда не сработает.
- Возвращать строки `"true"` вместо литеральных типов `true`.
- Ожидать, что `IsString<string | number>` вернёт `false`. Распределение даёт `boolean`.

## 7. Что запомнить

Условный тип — тернарный оператор над типами, где `extends` означает «присваивается в». Голый параметр типа слева распределяет условие по вариантам объединения, а `never` в результате удаляет вариант.
