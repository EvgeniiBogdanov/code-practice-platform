# Разбор задачи: «Литералы и as const»

## 1. Что дано

Функция `request` принимает метод только из объединения `"GET" | "POST"`. Значения передаются правильные, но TypeScript всё равно сообщает: `Argument of type 'string' is not assignable to parameter of type 'HttpMethod'`. Также нужно получить тип `Route` из массива, а не дублировать маршруты вручную.

## 2. Что такое расширение литералов

У значения `"GET"` есть литеральный тип `"GET"`. Но когда значение попадает в изменяемое место, TypeScript **расширяет** (widening) тип до `string`, потому что потом туда можно записать другую строку:

| Объявление | Тип |
| --- | --- |
| `const method = "GET"` | `"GET"` |
| `let method = "GET"` | `string` |
| `const options = { method: "POST" }` | `{ method: string }` |
| `const routes = ["/home"]` | `string[]` |

`const` защищает только переменную. Поле `options.method` и элементы массива можно изменить, поэтому их тип расширяется.

## 3. Решение по шагам

### Шаг 1. Переменная

Если значение не меняется — `const`. Если меняется — явная аннотация `let method: HttpMethod = "GET"`, тогда переприсвоить можно только другим методом.

### Шаг 2. Объект — as const

```ts
const options = { url: "/users", method: "POST" } as const;
// { readonly url: "/users"; readonly method: "POST" }
```

`as const` — это «константное утверждение»: литералы не расширяются, поля становятся `readonly`, массивы — `readonly`-кортежами. Действует рекурсивно.

### Шаг 3. Тип из массива

```ts
const routes = ["/home", "/about"] as const; // readonly ["/home", "/about"]
type Route = (typeof routes)[number];        // "/home" | "/about"
```

Разберём запись:

- `typeof routes` в позиции типа — тип значения `routes`;
- `[number]` — индексный доступ «элемент по любому числовому индексу», то есть объединение типов всех элементов.

Массив остаётся единственным источником истины: добавили маршрут — тип обновился сам. Массив при этом доступен и во время выполнения, например для меню.

### Полный код

```ts
type HttpMethod = "GET" | "POST";

const request = (url: string, method: HttpMethod): void => {
  console.log(method, url);
};

const method = "GET";
request("/users", method);

const options = { url: "/users", method: "POST" } as const;
request(options.url, options.method);

const routes = ["/home", "/about"] as const;
type Route = (typeof routes)[number];
```

## 4. Почему не as HttpMethod

```ts
const options = { method: "PATCH" as HttpMethod }; // ошибки нет... но должна быть
```

Утверждение `as` говорит компилятору «поверь мне». При сужении типа TypeScript его пропустит, даже если значение не входит в объединение. `as const` ничего не утверждает, а только сохраняет точный тип, поэтому `"PATCH"` в `request` вызовет ошибку.

Есть и третий вариант — аннотация поля: `const options: { url: string; method: HttpMethod } = { ... }`. Она точна, но требует описывать тип вручную. Ещё один способ — `satisfies`, о нём будет отдельная задача.

## 5. Частые ошибки

- Писать `typeof routes[number]` без `as const`: результат будет `string`.
- Ожидать, что `as const` заморозит объект во время выполнения. Это только тип; для рантайма нужен `Object.freeze`.
- Использовать `as const` на объекте, который потом нужно изменять: все поля станут `readonly`.

## 6. Что запомнить

Изменяемые места расширяют литералы до общего типа. `as const` отключает расширение и делает данные неизменяемыми на уровне типов, а связка `as const` + `typeof` + индексный доступ позволяет выводить типы из значений вместо дублирования.
