# Разбор задачи: «Статусы заказа»

## 1. Что дано

Статусы заказа нужны в двух мирах:

- **на этапе компиляции** — чтобы `changeStatus("lost")` было ошибкой;
- **во время выполнения** — чтобы обращаться к `OrderStatus.Pending` и строить выпадающий список из всех статусов.

Объединение строковых литералов `"pending" | "shipped" | ...` существует только в типах и после компиляции исчезает. Нужна конструкция, которая даёт и объект, и тип.

## 2. Что нужно получить

| Требование | Пример |
| --- | --- |
| значение из объекта | `changeStatus(OrderStatus.Pending)` |
| литерал из API | `changeStatus("shipped")` |
| неизвестный статус — ошибка | `changeStatus("lost")` |
| список всех значений | `Object.values(...)` |

## 3. Два кандидата: enum и объект с as const

```ts
enum OrderStatus {
  Pending = "pending",
  Shipped = "shipped",
}
```

`enum` создаёт и объект, и тип. Но у строкового enum есть важное свойство: он **номинален**. Параметр типа `OrderStatus` не примет литерал `"shipped"`, хотя значение совпадает:

```ts
changeStatus("shipped"); // Ошибка: '"shipped"' is not assignable to 'OrderStatus'
```

Значит, данные из API придётся приводить через `as` или сопоставлять вручную. По условию задачи это не подходит.

Объект с `as const` — обычный JavaScript, из которого тип выводится:

```ts
const OrderStatus = {
  Pending: "pending",
  Shipped: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
} as const;
```

## 4. Решение по шагам

### Шаг 1. Объект — источник истины

`as const` сохраняет литеральные типы значений и делает поля `readonly`. Без него тип каждого поля расширился бы до `string`.

### Шаг 2. Вывести тип значений

```ts
type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
```

Читаем изнутри наружу:

1. `typeof OrderStatus` — тип объекта: `{ readonly Pending: "pending"; ... }`.
2. `keyof typeof OrderStatus` — объединение ключей: `"Pending" | "Shipped" | ...`.
3. Индексный доступ по объединению ключей даёт объединение значений: `"pending" | "shipped" | "delivered" | "cancelled"`.

Объект и тип могут называться одинаково: TypeScript понимает по контексту, что имеется в виду — значение или тип. Так же устроен `enum`.

### Шаг 3. Список для интерфейса

`Object.values(OrderStatus)` возвращает массив значений, и благодаря `as const` его тип — массив литералов, а не `string[]`.

### Полный код

```ts
const OrderStatus = {
  Pending: "pending",
  Shipped: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
} as const;

type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

const changeStatus = (newStatus: OrderStatus): void => {
  console.log(`Статус изменён на ${newStatus}`);
};

changeStatus(OrderStatus.Pending);
changeStatus("shipped");

const statusOptions: OrderStatus[] = Object.values(OrderStatus);
```

## 5. enum или as const: что отвечать на собеседовании

| Критерий | `enum` | объект `as const` |
| --- | --- | --- |
| Объект во время выполнения | да | да |
| Принимает литерал `"shipped"` | нет, номинален | да |
| Генерирует дополнительный JS-код | да | нет, это обычный объект |
| Совместим с `erasableSyntaxOnly` и запуском `.ts` в Node.js | нет | да |
| Обратное отображение | у числовых enum | нет |

Числовые enum несут дополнительные сюрпризы: `Direction[0]` возвращает имя члена, а до TypeScript 5.0 параметр числового enum принимал любое число. `const enum` встраивает значения, но плохо работает с `isolatedModules`, который используют Vite, esbuild и SWC.

Enum оправдан, когда номинальность — желаемое свойство (значение можно получить только из самого enum) или когда он уже принят в кодовой базе.

## 6. Частые ошибки

- Забыть `as const`: тип станет `string`, и `changeStatus("lost")` скомпилируется.
- Дублировать значения: объявить объект и отдельно `type OrderStatus = "pending" | ...`. Добавив статус в одном месте, легко забыть другое.
- Написать `keyof typeof OrderStatus` и получить ключи (`"Pending"`), а не значения (`"pending"`).

## 7. Что запомнить

Объект `as const` + `(typeof X)[keyof typeof X]` даёт и рантайм-значения, и тип без дублирования, принимает литералы из внешних данных и остаётся обычным JavaScript.
