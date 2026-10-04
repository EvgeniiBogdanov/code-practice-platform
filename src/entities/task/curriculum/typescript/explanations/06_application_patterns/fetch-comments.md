# Разбор задачи: «Получение данных»

## 1. Что дано

Есть адрес `https://jsonplaceholder.typicode.com/comments` и заготовка функции `getData(url)`. После получения комментариев нужно вывести каждый в формате `ID: id, Email: email`.

От комментария нужны два поля: числовой `id` и строковый `email`. Важное условие: ответ сервера — **внешние данные**, и его структуру нужно проверить.

## 2. Что нужно получить

- `getData` возвращает `Promise<ApiComment[]>`.
- Неуспешный HTTP-ответ завершает промис ошибкой.
- Ответ, не похожий на массив комментариев, тоже завершает промис ошибкой — до того, как данные попадут в остальной код.

## 3. Почему «просто вернуть response.json()» — ловушка

Самое частое решение на собеседовании:

```ts
const getData = async (url: string): Promise<ApiComment[]> => {
  const response = await fetch(url);
  return response.json();
};
```

Оно компилируется, но ничего не гарантирует. В стандартной библиотеке `json()` объявлен как `Promise<any>`, а `any` молча присваивается в `ApiComment[]`. Аннотация описывает **ожидание**, а не проверенный факт. Если сервер вернёт `{ error: "..." }` или поменяет `email` на `mail`, ошибка всплывёт далеко от запроса — в компоненте, который выводит данные.

Хороший ответ на собеседовании начинается с этого замечания.

## 4. Решение по шагам

### Шаг 1. Описать используемые поля

```ts
interface ApiComment {
  id: number;
  email: string;
}
```

Мы описываем только поля, которые использует код. Имя `ApiComment`, а не `Comment`, чтобы не путать с глобальным DOM-типом `Comment` (узел комментария в HTML).

### Шаг 2. Проверить HTTP-статус

`fetch` отклоняет промис только при сетевой ошибке. Ответы `404` и `500` считаются успешно полученными, поэтому статус проверяем через `response.ok`.

### Шаг 3. Сохранить JSON как unknown

```ts
const data: unknown = await response.json();
```

Явная аннотация `unknown` «выключает» `any`: дальше с `data` ничего нельзя сделать без проверки.

### Шаг 4. Проверить структуру type guard'ом

```ts
const isApiComment = (value: unknown): value is ApiComment =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  typeof value.id === "number" &&
  "email" in value &&
  typeof value.email === "string";

if (!Array.isArray(data) || !data.every(isApiComment)) {
  throw new Error("Ответ сервера не соответствует ожидаемому формату");
}
```

`Array.isArray` сужает `data` до массива, а `every` с предикатом сужает его до `ApiComment[]`: у `every` есть перегрузка `every<S extends T>(predicate: (value: T) => value is S): this is S[]`. После проверки `return data` возвращает уже проверенные данные.

### Полный код

```ts
interface ApiComment {
  id: number;
  email: string;
}

const isApiComment = (value: unknown): value is ApiComment =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  typeof value.id === "number" &&
  "email" in value &&
  typeof value.email === "string";

const getData = async (url: string): Promise<ApiComment[]> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Не удалось загрузить данные: HTTP ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data) || !data.every(isApiComment)) {
    throw new Error("Ответ сервера не соответствует ожидаемому формату");
  }

  return data;
};

getData(COMMENTS_URL).then((data) => {
  data.forEach(({ id, email }) => {
    console.log(`ID: ${id}, Email: ${email}`);
  });
});
```

## 5. Как выполняется код

1. `fetch` отправляет запрос и возвращает промис с `Response`.
2. Если статус не `2xx`, бросаем ошибку — промис `getData` отклонён, `.then` не выполнится.
3. `response.json()` читает и разбирает тело.
4. Проверка структуры: массив, и каждый элемент — комментарий.
5. Вызывающий код получает `ApiComment[]` и печатает строки.

## 6. Обобщённая обёртка: как не надо и как надо

```ts
// Опасно: T выбирает вызывающий код, проверки нет — это as в красивой обёртке
const fetchJson = async <T>(url: string): Promise<T> => (await fetch(url)).json();

// Безопасно: тип выводится из проверки
const fetchJson = async <T>(url: string, isValid: (value: unknown) => value is T): Promise<T> => {
  const data: unknown = await (await fetch(url)).json();
  if (!isValid(data)) throw new Error("Неверный формат ответа");
  return data;
};
```

В реальных проектах вместо ручных предикатов используют библиотеки схем: zod, valibot. Схема описывается один раз, тип выводится из неё (`z.infer<typeof schema>`), а `schema.parse(data)` проверяет данные во время выполнения.

## 7. Частые ошибки

- Доверять аннотации `Promise<ApiComment[]>` без проверки.
- Забыть `response.ok`: ответ `404` с HTML-страницей сломается на `json()` с непонятной ошибкой.
- Проверить только `Array.isArray` и не проверить элементы.
- Объявить интерфейс `Comment` и случайно сослаться на глобальный DOM-тип в файле-скрипте.

## 8. Что запомнить

Типы не существуют во время выполнения, поэтому данные из сети, `localStorage` или `postMessage` — это `unknown`, пока их не проверили. Граница приложения — место для проверки, после неё код работает с точными типами.
