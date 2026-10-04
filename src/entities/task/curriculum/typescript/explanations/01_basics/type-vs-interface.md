# Разбор задачи: «type или interface»

## 1. Что дано

Три объекта без типов и интерфейс `Theme`, который нельзя редактировать: представим, что он объявлен в сторонней библиотеке. Объект `theme` уже содержит поле `brandColor`, которого нет в `Theme`, поэтому код не компилируется.

## 2. Что нужно получить

| Часть | Что описать | Чем |
| --- | --- | --- |
| 1 | фигура — круг **или** квадрат | `type` (объединение) |
| 2 | новое поле в чужом `Theme` | `interface` (слияние объявлений) |
| 3 | любая фигура **и** цвет | `type` (пересечение с объединением) |

## 3. В чём разница

Для обычного объекта `type` и `interface` почти взаимозаменяемы. Различия проявляются на границах:

| Возможность | `type` | `interface` |
| --- | --- | --- |
| Объектная форма | да | да |
| Объединение, кортеж, примитив | да | нет |
| Mapped и conditional types | да | нет |
| Слияние объявлений | нет, повторное имя — ошибка | да |
| Наследование | через `&` | через `extends` с ранней проверкой конфликтов |

Практическое правило многих команд: `interface` для объектных контрактов (моделей, пропсов, публичного API), `type` — для всего остального.

## 4. Решение по шагам

### Шаг 1. Shape — только через type

`interface` описывает одну объектную форму. «Круг или квадрат» — это объединение, поэтому:

```ts
interface Circle { kind: "circle"; radius: number }
interface Square { kind: "square"; side: number }
type Shape = Circle | Square;
```

Поле `kind` с литеральным типом позволит позже сужать `Shape` проверкой `shape.kind === "circle"`.

### Шаг 2. Theme — через слияние объявлений

Если объявить интерфейс с тем же именем в той же области видимости, TypeScript объединит их поля:

```ts
interface Theme {
  brandColor: string;
}
```

Теперь `Theme` требует и `primaryColor`, и `brandColor`. Именно так расширяют типы библиотек: `Window`, `Request` в Express, тему в styled-components. С `type` этот приём невозможен: повторное объявление псевдонима — ошибка `Duplicate identifier`.

### Шаг 3. ColoredShape — пересечение

```ts
type ColoredShape = Shape & { color: string };
```

Пересечение с объединением распределяется по вариантам: `(Circle & { color: string }) | (Square & { color: string })`. Через `interface ColoredShape extends Shape` так сделать нельзя: интерфейс не может расширять объединение.

### Полный код

```ts
interface Theme {
  primaryColor: string;
}

interface Theme {
  brandColor: string;
}

interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  side: number;
}

type Shape = Circle | Square;
type ColoredShape = Shape & { color: string };

const theme: Theme = { primaryColor: "black", brandColor: "orange" };
const circle: Shape = { kind: "circle", radius: 10 };
const square: Shape = { kind: "square", side: 5 };
const coloredCircle: ColoredShape = { kind: "circle", radius: 3, color: "red" };
```

## 5. extends и & ведут себя по-разному при конфликте

```ts
interface A { id: string }
interface B extends A { id: number } // ошибка сразу: id несовместим

type C = A & { id: number }; // ошибки нет, но C["id"] — это string & number, то есть never
```

`extends` сообщает о конфликте в объявлении. Пересечение молча даёт `never`, и ошибка всплывает позже, в месте использования. Кроме того, интерфейсы кешируются компилятором, а пересечения вычисляются заново, поэтому в больших проектах `extends` быстрее.

## 6. Частые ошибки

- Пытаться описать объединение через `interface`.
- Случайно сливать интерфейсы: объявить в скрипте без `import`/`export` интерфейс с именем `Event` или `Response` и незаметно добавить поля в глобальный тип.
- Считать, что `type` нельзя реализовать в классе. Можно, если `type` описывает объектную форму, а не объединение.

## 7. Что запомнить

`type` нужен для объединений, кортежей и вычисляемых типов. `interface` — для расширяемых объектных контрактов, включая слияние объявлений. На собеседовании ценится не «правильный» выбор, а умение назвать конкретные различия.
