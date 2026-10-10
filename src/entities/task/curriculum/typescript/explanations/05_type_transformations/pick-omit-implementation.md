# Разбор задачи: «Свои Pick и Omit»

## 1. Что дано

`Pick` и `Omit` — самые используемые служебные типы и самый частый вопрос «реализуйте сами». Нужно повторить их поведение, включая сохранение модификаторов, и сделать строгую версию `Omit`.

## 2. Что нужно получить

| Тип | Пример | Результат |
| --- | --- | --- |
| `MyPick<User, "name" \| "password">` | выбрать ключи | `{ name: string; password: string }` |
| `MyOmit<User, "password">` | исключить ключи | `{ readonly id: number; name: string; email?: string }` |
| `MyPick<User, "age">` | несуществующий ключ | ошибка |
| `StrictOmit<User, "pasword">` | опечатка | ошибка |

## 3. MyPick: обходим не все ключи, а выбранные

```ts
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
```

- Ограничение `K extends keyof T` разрешает только существующие ключи, поэтому `MyPick<User, "age">` — ошибка.
- `[P in K]` создаёт поле для каждого выбранного ключа.
- `T[P]` берёт тип поля из исходного типа.

Отображаемый тип по ключам `K extends keyof T` TypeScript тоже считает гомоморфным и переносит модификаторы: в `MyPick<User, "id">` поле останется `readonly`.

## 4. MyOmit: Pick от оставшихся ключей

```ts
type MyOmit<T, K extends PropertyKey> = MyPick<T, Exclude<keyof T, K>>;
```

1. `keyof User` — `"id" | "name" | "email" | "password"`.
2. `Exclude<keyof User, "password">` — `"id" | "name" | "email"`.
3. `MyPick` по этим ключам — тип без пароля с сохранёнными модификаторами.

`PropertyKey` — встроенный псевдоним `string | number | symbol`, то же самое, что `keyof any` в объявлении стандартного `Omit`.

## 5. StrictOmit

Встроенный `Omit` ограничивает ключи как `K extends keyof any`, а не `keyof T`. Поэтому `Omit<User, "pasword">` с опечаткой ошибки не даёт и молча возвращает `User` целиком — пароль утечёт в «публичный» тип. Строгая версия просто усиливает ограничение:

```ts
type StrictOmit<T, K extends keyof T> = MyOmit<T, K>;
```

Почему стандартный `Omit` не строгий? Чтобы его можно было применять к параметрам типов, ключи которых неизвестны в момент объявления. Многие проекты добавляют `StrictOmit` в общие утилиты.

### Полный код

```ts
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyOmit<T, K extends PropertyKey> = MyPick<T, Exclude<keyof T, K>>;
type StrictOmit<T, K extends keyof T> = MyOmit<T, K>;
```

## 6. Альтернатива: переименование ключей

```ts
type MyOmit<T, K extends PropertyKey> = { [P in keyof T as P extends K ? never : P]: T[P] };
```

Ключ, для которого выражение после `as` даёт `never`, исчезает. Подробнее — в задаче о переименовании ключей.

## 7. Omit и объединения

`keyof (A | B)` — только общие ключи. Поэтому `Omit<Circle | Square, "id">` вернёт объект только с общими полями, и уникальные `radius` и `side` пропадут. Для объединений нужна распределяющая версия:

```ts
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
```

Этот вопрос часто задают после реализации `Omit`.

## 8. Частые ошибки

- Забыть ограничение `K extends keyof T` в `MyPick`: тогда `T[P]` — ошибка, потому что `P` может не быть ключом `T`.
- Строить `MyOmit` через `[P in Exclude<keyof T, K>]` напрямую. Такой отображаемый тип не гомоморфный, и модификаторы теряются: `email?` станет обязательным, а `readonly id` — изменяемым. Через `MyPick` (ключи ограничены `keyof T`) они сохраняются.
- Считать, что `Omit` удаляет поле из объекта во время выполнения.

## 9. Что запомнить

`Pick` — отображаемый тип по выбранным ключам, `Omit` — `Pick` по ключам, оставшимся после `Exclude`. Встроенный `Omit` не проверяет ключи, поэтому полезно знать и уметь написать `StrictOmit`.
