# Разбор задачи: «Распределение по объединению»

## 1. Что дано

Условный тип с голым параметром распределяется по объединению: применяется к каждому варианту отдельно. Обычно это удобно (`Exclude`, `Extract`), но иногда мешает. Нужно научиться управлять распределением и разобраться со странным поведением `never`.

## 2. Что нужно получить

| Тип | Результат |
| --- | --- |
| `ToArrayNonDist<string \| number>` | `(string \| number)[]` |
| `IsNever<never>` | `true` |
| `IsNever<string>` | `false` |
| `IsUnion<string \| number>` | `true` |
| `IsUnion<string>` | `false` |
| `IsUnion<never>` | `false` |

## 3. Когда условный тип распределяется

Распределение происходит, если **слева от `extends` стоит голый параметр типа**, а при использовании в него передано объединение:

```ts
type ToArray<T> = T extends unknown ? T[] : never;

ToArray<string | number>
// = ToArray<string> | ToArray<number>
// = string[] | number[]
```

Любая обёртка вокруг `T` — кортеж `[T]`, массив `T[]`, объект `{ x: T }` — делает параметр «не голым», и распределение отключается.

## 4. Решение по шагам

### Шаг 1. ToArrayNonDist

```ts
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;
```

`[string | number] extends [unknown]` — одна проверка для всего объединения, результат — `(string | number)[]`.

### Шаг 2. Почему наивный IsNever ломается

```ts
type IsNever<T> = T extends never ? true : false;
IsNever<never> // never, а не true
```

`never` — это **пустое объединение**, объединение из нуля вариантов. Распределение применяет условие к каждому варианту, а вариантов нет. Объединение нуля результатов — снова `never`. Ни одна ветка не выбирается.

Решение — отключить распределение:

```ts
type IsNever<T> = [T] extends [never] ? true : false;
```

`[never] extends [never]` — обычная проверка, результат `true`.

### Шаг 3. IsUnion

Идея: распределить `T` по вариантам и сравнить каждый вариант со **всем** исходным объединением. Если `T` — один тип, вариант совпадёт с целым. Если объединение, вариант `string` не совместим с целым `string | number`.

```ts
type IsUnion<T, U = T> =
  IsNever<T> extends true ? false : T extends unknown ? ([U] extends [T] ? false : true) : never;
```

1. Второй параметр `U = T` сохраняет копию исходного типа до распределения.
2. `T extends unknown ? ... : never` распределяет `T` по вариантам.
3. Внутри `T` — уже один вариант, а `U` — всё объединение. `[U] extends [T]` без распределения проверяет, помещается ли целое в вариант.
4. Для `string | number`: `[string | number] extends [string]` — ложь, результат `true` для каждого варианта, итог `true`.
5. Для `string`: `[string] extends [string]` — истина, итог `false`.
6. Для `never` распределение дало бы `never`, поэтому этот случай обрабатываем отдельно в начале.

### Полный код

```ts
type ToArray<T> = T extends unknown ? T[] : never;
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;

type IsNever<T> = [T] extends [never] ? true : false;

type IsUnion<T, U = T> =
  IsNever<T> extends true ? false : T extends unknown ? ([U] extends [T] ? false : true) : never;
```

## 5. Неочевидные объединения

`IsUnion<boolean>` — `true`, потому что `boolean` — это `true | false`. Поэтому `ToArray<boolean>` даёт `false[] | true[]`, а не `boolean[]`. Тип строкового или числового `enum` — тоже объединение его членов. Об этом часто спрашивают как «подвох».

## 6. Где это применяется

- `Exclude`, `Extract` и распределяющий `Omit` — полезное распределение.
- `[T] extends [never]` — стандартная проверка на `never` в библиотеках типов.
- Отключение распределения нужно, когда объединение должно обрабатываться как одно целое: например, проверка «все варианты — строки».

## 7. Частые ошибки

- Ожидать, что `T extends never ? ...` поймает `never`.
- Не замечать, что `boolean` распределяется на `true | false`.
- Использовать распределение там, где нужен один результат для всего объединения.

## 8. Что запомнить

Голый параметр типа слева от `extends` распределяет условие по вариантам объединения, обёртка `[T]` это отключает. `never` — пустое объединение, поэтому распределение по нему всегда даёт `never`.
