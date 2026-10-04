# Разбор задачи: «Пользовательский type guard»

## 1. Что дано

Встроенные проверки `typeof`, `in` и `instanceof` работают прямо в условии. Но проверку структуры `User` хочется написать один раз и переиспользовать. Если вынести её в функцию, возвращающую `boolean`, TypeScript перестанет сужать тип:

```ts
const isUser = (value: unknown): boolean => ...;
if (isUser(input)) {
  input.name; // Ошибка: input всё ещё unknown
}
```

## 2. Что нужно получить

- `isUser(input)` в условии сужает `input` до `User`.
- `people.filter(isAdmin)` возвращает `Admin[]`.

## 3. Предикат типа

Возвращаемый тип `value is User` — это **предикат типа**. Он говорит компилятору: «если функция вернула `true`, аргумент `value` имеет тип `User`». Во время выполнения функция возвращает обычный `boolean`.

```ts
const isUser = (value: unknown): value is User =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  typeof value.id === "number" &&
  "name" in value &&
  typeof value.name === "string";
```

Внутри — те же шаги, что и при проверке `unknown` вручную: объект, не `null`, есть ключ, ключ нужного типа.

## 4. Решение по шагам

### Шаг 1. isUser для внешних данных

Параметр имеет тип `unknown`, потому что проверять нужно именно непроверенные данные. После `if (isUser(input))` тип `input` — `User`.

### Шаг 2. isAdmin для различения вариантов

```ts
const isAdmin = (person: User | Admin): person is Admin =>
  "permissions" in person;
```

Тип предиката должен быть совместим с типом параметра: `Admin` — один из вариантов `User | Admin`.

### Шаг 3. Предикат в filter

У `Array.prototype.filter` есть перегрузка, принимающая предикат:

```ts
filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S): S[];
```

Когда вы передаёте функцию с предикатом, `filter` возвращает `S[]`, то есть `Admin[]`.

### Полный код

```ts
const isUser = (value: unknown): value is User =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  typeof value.id === "number" &&
  "name" in value &&
  typeof value.name === "string";

const isAdmin = (person: User | Admin): person is Admin =>
  "permissions" in person;

const admins: Admin[] = people.filter(isAdmin);
```

## 5. Предикат — это обещание

TypeScript не проверяет, что тело предиката действительно проверяет `User`. Этот код компилируется:

```ts
const isUser = (value: unknown): value is User => true; // ложь
```

Ответственность за корректность — на авторе, как и с утверждением `as`. Поэтому предикаты держат рядом с моделью, покрывают тестами, а для сложных структур используют библиотеки схем (zod, valibot), которые генерируют проверку и тип из одного описания.

## 6. Выведенные предикаты (TypeScript 5.5)

С версии 5.5 простые стрелки получают предикат автоматически:

```ts
const values = [1, null, 2].filter((x) => x !== null); // number[]
```

Компилятор выводит `x is number`, если в ветке `true` тип сужается, а в ветке `false` точно исключается. Для `isUser` с несколькими полями и `unknown` на входе явная аннотация по-прежнему нужна и лучше документирует намерение.

## 7. Частые ошибки

- Возвращать `boolean` вместо `value is User`.
- Проверять только наличие ключей без их типов: `{ id: "1", name: 2 }` пройдёт проверку.
- Забыть `value !== null`: `typeof null === "object"`.
- Писать предикат с параметром `any`: внутри не будет ошибок при опечатке в имени поля.

## 8. Что запомнить

Предикат `value is T` переносит сужение типа из условия в переиспользуемую функцию и работает с `filter`, `find` и другими методами. Корректность проверки остаётся на совести автора.
