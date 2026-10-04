# Разбор задачи: «Свои ReturnType, Parameters и Awaited»

## 1. Что дано

Встроенные `ReturnType`, `Parameters` и `Awaited` уже знакомы по разделу служебных типов. Теперь нужно понять, как они устроены: все они построены на условных типах с `infer`.

## 2. Что нужно получить

| Тип | Пример | Результат |
| --- | --- | --- |
| `MyReturnType<typeof log>` | результат | `boolean` |
| `MyParameters<typeof log>` | параметры | `[data: string[], count: number]` |
| `MyAwaited<Promise<Promise<number>>>` | значение после `await` | `number` |
| `FirstArg<typeof log>` | первый параметр | `string[]` |

## 3. infer — «найди тип по шаблону»

`infer X` объявляет переменную типа прямо внутри условия. TypeScript сопоставляет проверяемый тип с шаблоном и, если сопоставление удалось, записывает в `X` совпавшую часть:

```ts
type ElementType<T> = T extends (infer U)[] ? U : never;
//                                ^ «что угодно на месте элемента — назови это U»
```

`infer` можно использовать только в части `extends` условного типа.

## 4. Тип «любая функция»

Чтобы ограничить параметр функциями, нужен тип, с которым совместима **любая** функция:

```ts
type AnyFunction = (...args: never[]) => unknown;
```

- Результат `unknown` — любой результат подходит к `unknown`.
- Параметры `never[]` — параметры сравниваются в обратную сторону. Функция `(x: string) => void` подходит, если её можно вызвать с аргументами типа `never`, а `never` можно передать в параметр любого типа.

`(...args: unknown[]) => unknown` не подойдёт: функция, ожидающая строку, не может принять «что угодно». `(...args: any[]) => any` подойдёт, но использует `any`.

## 5. Решение по шагам

### MyReturnType

```ts
type MyReturnType<F extends AnyFunction> = F extends (...args: never[]) => infer R ? R : never;
```

Шаблон «функция с любыми параметрами, результат — `R`». Для `typeof log` получаем `R = boolean`.

### MyParameters

```ts
type MyParameters<F extends AnyFunction> = F extends (...args: infer P) => unknown ? P : never;
```

`infer P` на месте rest-параметра выводит кортеж всех параметров, вместе с их метками.

### MyAwaited — рекурсия

```ts
type MyAwaited<T> = T extends PromiseLike<infer U> ? MyAwaited<U> : T;
```

`PromiseLike` описывает любой объект с методом `then`, как и `await`. Если `T` — промис, извлекаем `U` и **снова** применяем `MyAwaited`: `await` снимает все уровни вложенности. Когда `T` больше не промис, возвращаем его.

| Шаг | `T` | Результат шага |
| --- | --- | --- |
| 1 | `Promise<Promise<number>>` | `MyAwaited<Promise<number>>` |
| 2 | `Promise<number>` | `MyAwaited<number>` |
| 3 | `number` | `number` |

### FirstArg

```ts
type FirstArg<F extends AnyFunction> = F extends (first: infer A, ...rest: never[]) => unknown ? A : never;
```

Шаблон «первый параметр — `A`, остальные — любые».

### Полный код

```ts
type AnyFunction = (...args: never[]) => unknown;

type MyReturnType<F extends AnyFunction> = F extends (...args: never[]) => infer R ? R : never;

type MyParameters<F extends AnyFunction> = F extends (...args: infer P) => unknown ? P : never;

type MyAwaited<T> = T extends PromiseLike<infer U> ? MyAwaited<U> : T;

type FirstArg<F extends AnyFunction> = F extends (first: infer A, ...rest: never[]) => unknown
  ? A
  : never;
```

## 6. Перегрузки

Для перегруженной функции сопоставление с `infer` использует **последнюю** сигнатуру. `MyReturnType` от функции с перегрузками `(x: string): string` и `(x: number): number` вернёт `number`. Встроенный `ReturnType` ведёт себя так же.

## 7. Частые ошибки

- Использовать `infer` вне условного типа.
- Ограничивать функцию типом `Function`: с ним шаблон `(...args) => infer R` не совпадёт.
- Забыть рекурсию в `MyAwaited` и получить `Promise<number>` для двойного промиса.
- Писать ограничение `(...args: unknown[]) => unknown` и получать ошибки для функций с типизированными параметрами.

## 8. Что запомнить

`infer` выводит часть типа по шаблону. Почти все «разбирающие» утилиты — это одна строка вида `T extends Шаблон<infer X> ? X : never`, а рекурсивное применение позволяет снимать любое число уровней вложенности.
