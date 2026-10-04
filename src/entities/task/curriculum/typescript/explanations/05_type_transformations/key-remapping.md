# Разбор задачи: «Переименование и фильтрация ключей»

## 1. Что дано

Отображаемые типы умеют менять значения и модификаторы полей. С TypeScript 4.1 они умеют и **менять имена ключей** через `as`. Это основа типов для геттеров, обработчиков форм, событий и сторов.

## 2. Что нужно получить

| Тип | Из `{ name: string; age: number; isAdmin: boolean }` |
| --- | --- |
| `Getters` | `{ getName: () => string; getAge: () => number; getIsAdmin: () => boolean }` |
| `PickByValue<Person, string \| number>` | `{ name: string; age: number }` |
| `ChangeHandlers` | `{ onNameChange: (value: string) => void; ... }` |

## 3. Синтаксис as в отображаемом типе

```ts
{ [K in keyof T as НовоеИмя<K>]: Значение<T[K]> }
```

- `K in keyof T` — перебираем исходные ключи;
- `as НовоеИмя<K>` — вычисляем ключ результата;
- в значении по-прежнему доступен исходный `K` и `T[K]`.

Если `НовоеИмя<K>` даёт `never`, поле не создаётся. Так ключи фильтруют.

## 4. Решение по шагам

### Getters

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
```

Шаблонная строка собирает имя, `Capitalize` поднимает первую букву: `"name"` → `"getName"`.

Зачем `string & K`? `keyof T` в общем случае — `string | number | symbol`, а `Capitalize` и шаблонные строки с символами не работают. Пересечение со `string` оставляет строковые ключи; для символа результат — `never`, и такой ключ просто исчезает.

### PickByValue

```ts
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};
```

Для каждого ключа проверяем тип значения. Подходит — оставляем имя `K`, нет — `never`, и поле отбрасывается. `isAdmin: boolean` не совместим с `string | number`, поэтому его нет в результате.

### ChangeHandlers

```ts
type ChangeHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};
```

Имя меняется, но значение по-прежнему связано с исходным полем: `onAgeChange` получает `number`. Поэтому в объекте `handlers` параметры обработчиков выводятся без аннотаций.

### Полный код

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

type ChangeHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};
```

## 5. Тонкости

**Модификаторы сохраняются.** Тип с `as` по-прежнему обходит `keyof T`, поэтому остаётся гомоморфным: `readonly` и `?` исходных полей переносятся на новые ключи.

**Необязательные поля в PickByValue.** У поля `email?: string` тип значения — `string | undefined`. Проверка `T[K] extends string` для него ложна. Если нужно учитывать такие поля, сравнивают с `V | undefined` или применяют `-?`.

**Обратная операция.** Из `"onNameChange"` имя поля можно получить шаблоном с `infer`: `K extends \`on${infer Name}Change\` ? Uncapitalize<Name> : never`.

## 6. Частые ошибки

- Писать `Capitalize<K>` без `string &`: ошибка `Type 'K' does not satisfy the constraint 'string'`.
- Фильтровать ключи через `Pick<T, ...>` с отдельным вычислением ключей, когда достаточно `as ... never`.
- Забыть, что `boolean` — объединение `true | false`: проверка `T[K] extends true` для `boolean` ложна.

## 7. Что запомнить

`as` в отображаемом типе вычисляет новое имя ключа, `never` удаляет ключ, а шаблонные строки с `Capitalize` строят имена вроде `getName` и `onNameChange`. Значение по-прежнему связано с исходным полем через `T[K]`.
