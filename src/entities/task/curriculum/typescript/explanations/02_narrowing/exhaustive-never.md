# Разбор задачи: «Проверка полноты через never»

## 1. Что дано

`getArea` перебирает виды фигур в `switch`. Сейчас обработаны все варианты, и код компилируется. Проблема появится позже: кто-то добавит в `Shape` новый вид и забудет про `getArea`.

## 2. Что произойдёт без защиты

Если добавить `triangle` и не трогать `getArea`, TypeScript покажет `Function lacks ending return statement`. Защита вроде бы есть, но:

- сообщение не говорит, какой вариант пропущен;
- для функции, возвращающей `void`, ошибки не будет вовсе;
- если в конце функции есть `return 0` «на всякий случай», ошибка тоже пропадёт, а треугольник молча получит площадь 0.

Нужна явная проверка полноты (exhaustiveness check).

## 3. Идея: в default не должно остаться вариантов

Каждый `case` сужает `shape`, исключая обработанный вид. В ветке `default` остаётся то, что не обработано. Если обработано всё, остаётся пустое объединение — `never`.

Значит, достаточно потребовать, чтобы в `default` значение имело тип `never`:

```ts
const assertNever = (value: never): never => {
  throw new Error(`Необработанный вариант: ${JSON.stringify(value)}`);
};
```

Пока все варианты обработаны, `assertNever(shape)` компилируется. Пропущенный вариант оставит в `default` его тип, например `{ kind: "triangle"; ... }`, а его нельзя передать в параметр `never`:

```
Argument of type '{ kind: "triangle"; base: number; height: number; }'
is not assignable to parameter of type 'never'.
```

Сообщение сразу показывает, что именно забыли.

## 4. Решение по шагам

### Шаг 1. Добавить default с assertNever

`return assertNever(shape)` — вызов внутри `return`, поэтому функция с типом `number` корректна во всех ветках.

### Шаг 2. Расширить Shape

После добавления `triangle` проверка сработает и укажет на `getArea`.

### Шаг 3. Обработать новый вариант

В `case "triangle"` TypeScript сужает `shape` до треугольника, и поля `base` и `height` доступны.

### Полный код

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "triangle"; base: number; height: number };

const assertNever = (value: never): never => {
  throw new Error(`Необработанный вариант: ${JSON.stringify(value)}`);
};

const getArea = (shape: Shape): number => {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      return assertNever(shape);
  }
};
```

## 5. Зачем бросать исключение

Типы проверяются при компиляции, но данные приходят во время выполнения. Сервер может прислать `{ kind: "hexagon" }` раньше, чем фронтенд обновится. Без исключения функция вернула бы `undefined`, и ошибка проявилась бы далеко от источника. `assertNever` падает сразу и с понятным сообщением.

## 6. Альтернативы

```ts
default: {
  const unreachable: never = shape;      // присваивание в never
  throw new Error(`Неизвестная фигура: ${JSON.stringify(unreachable)}`);
}
```

```ts
default:
  throw new Error(`Неизвестная фигура: ${shape satisfies never}`);
```

Без `switch` полноту даёт объект-обработчик: тип `Record<Shape["kind"], (shape: ...) => number>` требует ключ для каждого вида. В ESLint есть правило `@typescript-eslint/switch-exhaustiveness-check`.

## 7. Частые ошибки

- Писать `default: return 0`. Проверка полноты пропадает, новые виды получают неверный результат.
- Использовать `if` без финальной проверки: после цепочки `if` тоже нужно `assertNever(shape)`.
- Объявить параметр `assertNever` как `unknown`: тогда в него можно передать что угодно, и проверка не работает.

## 8. Что запомнить

`never` — тип «вариантов не осталось». Требуя `never` в ветке по умолчанию, вы превращаете пропущенный случай в ошибку компиляции, которая сразу указывает место и забытый вариант.
