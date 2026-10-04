# Разбор задачи: «Ограничения и значения по умолчанию»

## 1. Что дано

Три обобщённые конструкции, каждой не хватает своего инструмента:

- `findById` обращается к `item.id`, но у произвольного `T` поля `id` может не быть;
- `ApiResponse` нужен и с конкретным типом данных, и без него;
- `longest` читает `length`, которого нет у чисел.

## 2. Что нужно получить

| Конструкция | Инструмент |
| --- | --- |
| `findById<T>` — у `T` гарантированно есть `id` | ограничение `T extends Identifiable` |
| `ApiResponse` без параметра | значение по умолчанию `T = unknown` |
| `longest` только для значений с `length` | ограничение `T extends { length: number }` |

## 3. Ограничение — минимум требований

Без ограничения `<T>(items: T[])` внутри функции о `T` ничего не известно, и `item.id` — ошибка. Ограничение `T extends Identifiable` означает: «`T` — любой тип, у которого **как минимум** есть `id: number`».

Важно, что функция возвращает `T`, а не `Identifiable`. Если бы сигнатура была `(items: Identifiable[]) => Identifiable | undefined`, у результата осталось бы только поле `id`, а `title` и `price` пропали бы из типа. Ограничение проверяет вход, а параметр сохраняет полный тип.

## 4. Решение по шагам

### Шаг 1. findById

```ts
interface Identifiable {
  id: number;
}

const findById = <T extends Identifiable>(items: readonly T[], id: number): T | undefined =>
  items.find((item) => item.id === id);
```

Для `products` выводится `T = { id: number; title: string; price: number }`, и результат сохраняет все поля.

### Шаг 2. ApiResponse со значением по умолчанию

```ts
interface ApiResponse<T = unknown> {
  status: number;
  data: T;
}
```

`ApiResponse` без аргумента означает `ApiResponse<unknown>`: данные есть, но перед использованием их нужно проверить. `ApiResponse<string[]>` описывает ответ с известной структурой. `unknown` по умолчанию безопаснее, чем `any`.

### Шаг 3. longest

```ts
const longest = <T extends { length: number }>(a: T, b: T): T =>
  a.length >= b.length ? a : b;
```

Ограничение — структурное: подходит всё, у чего есть числовое `length`, то есть массивы, строки и объекты вроде `{ length: 3 }`. Для `longest(10, 100)` TypeScript сообщит, что у `number` нет поля `length`.

### Полный код

```ts
interface Identifiable {
  id: number;
}

const findById = <T extends Identifiable>(
  items: readonly T[],
  id: number
): T | undefined => items.find((item) => item.id === id);

interface ApiResponse<T = unknown> {
  status: number;
  data: T;
}

const longest = <T extends { length: number }>(a: T, b: T): T =>
  a.length >= b.length ? a : b;
```

## 5. Правила значений по умолчанию

- Параметры со значением по умолчанию идут после обязательных: `<T, U = string>`, но не `<T = string, U>`.
- Значение по умолчанию должно удовлетворять ограничению: `<T extends object = string>` — ошибка.
- Если `T` выводится из аргументов функции, значение по умолчанию не используется. Оно работает, когда выводить не из чего: в интерфейсах, классах, явных аннотациях.

## 6. extends в дженериках и в классах

`T extends X` в угловых скобках — не наследование, а проверка совместимости: «`T` можно присвоить в `X`». Поэтому `T extends { length: number }` подходит строкам, хотя строка ничего не «наследует».

## 7. Частые ошибки

- Возвращать тип ограничения вместо параметра и терять поля.
- Писать ограничение «на всякий случай» строже, чем нужно: `T extends Product`, когда используется только `id`.
- Использовать `any` как значение по умолчанию.

## 8. Что запомнить

Ограничение описывает минимум, который функция использует, а параметр типа сохраняет всё остальное. Значение по умолчанию задаёт тип, когда вывести его не из чего.
