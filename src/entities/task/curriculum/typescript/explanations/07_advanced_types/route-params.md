# Разбор задачи: «Параметры маршрута из строки»

## 1. Что дано

`buildUrl` подставляет значения в шаблон вида `/users/:userId/posts/:postId`. Без типов легко забыть параметр — получится `/users/1/posts/undefined` — или передать лишний. Имена параметров уже записаны в строке шаблона, и TypeScript умеет их оттуда извлечь.

## 2. Что нужно получить

| Шаблон | Тип `params` |
| --- | --- |
| `"/users/:userId/posts/:postId"` | `{ userId: string; postId: string }` |
| `"/users/:userId"` | `{ userId: string }` |
| `"/about"` | `{}` |

## 3. Извлечение имён: шаблон с infer

```ts
type ParamNames<Path extends string> = Path extends `${string}:${infer Param}/${infer Rest}`
  ? Param | ParamNames<Rest>
  : Path extends `${string}:${infer Param}`
    ? Param
    : never;
```

Сопоставление шаблонной строки идёт слева направо, и каждая часть перед следующим литералом захватывает **минимальную** подстроку:

- `${string}` — всё до первого `:`;
- `${infer Param}` — всё до первого `/` после двоеточия;
- `${infer Rest}` — остаток.

Если после параметра есть `/`, сохраняем `Param` и рекурсивно разбираем `Rest`. Если параметр последний, срабатывает вторая ветка. Если двоеточий нет — `never`.

| Шаг | Строка | Результат шага |
| --- | --- | --- |
| 1 | `"/users/:userId/posts/:postId"` | `"userId"` и разбор `"posts/:postId"` |
| 2 | `"posts/:postId"` | первая ветка не подходит, вторая даёт `"postId"` |
| итог | | `"userId" \| "postId"` |

## 4. Объект параметров

```ts
type RouteParams<Path extends string> = Record<ParamNames<Path>, string>;
```

`Record` с конечным объединением ключей требует каждый ключ. Для маршрута без параметров получается `Record<never, string>`, то есть `{}`. Лишний ключ в литерале отлавливается проверкой лишних свойств.

## 5. Функция

```ts
const buildUrl = <Path extends string>(path: Path, params: RouteParams<Path>): string => {
  const values: Record<string, string> = params;
  return path.replace(/:(\w+)/g, (_match, name: string) => encodeURIComponent(values[name] ?? ""));
};
```

- `Path extends string` сохраняет литерал шаблона, и из него вычисляется тип `params`.
- Внутри реализации имя параметра приходит из регулярного выражения как обычная `string`. Чтобы обратиться по нему, присваиваем `params` в словарь `Record<string, string>` — это безопасное расширение без утверждения типа.
- `encodeURIComponent` экранирует значения, чтобы `/` или `?` в параметре не сломали URL.

### Полный код

```ts
type ParamNames<Path extends string> = Path extends `${string}:${infer Param}/${infer Rest}`
  ? Param | ParamNames<Rest>
  : Path extends `${string}:${infer Param}`
    ? Param
    : never;

type RouteParams<Path extends string> = Record<ParamNames<Path>, string>;

const buildUrl = <Path extends string>(path: Path, params: RouteParams<Path>): string => {
  const values: Record<string, string> = params;
  return path.replace(/:(\w+)/g, (_match, name: string) => encodeURIComponent(values[name] ?? ""));
};
```

## 6. Ограничения и расширения

- Шаблон должен быть литералом. Если путь хранится в переменной типа `string`, `ParamNames<string>` даст `string`, и проверка ослабнет. Поэтому маршруты объявляют как `const` или с `as const`.
- Необязательные параметры (`:id?`) обрабатываются отдельной веткой `` Param extends `${infer Name}?` `` с построением необязательных ключей.
- Типы регулярного выражения и шаблона независимы: если в имени параметра будут символы вне `\w`, реализация и тип разойдутся.

Тот же приём используют React Router, Hono и Express 5 для типизации `params`.

## 7. Частые ошибки

- Ожидать, что `${string}` захватит максимальную подстроку: сопоставление «ленивое».
- Строить объект через рекурсивные пересечения вместо одного `Record` по объединению имён.
- Индексировать `params[name]` по `string` внутри реализации и получать ошибку — достаточно расширить тип до словаря.

## 8. Что запомнить

Шаблонные литеральные типы с `infer` разбирают строки на уровне типов, а рекурсия позволяет обработать любое число параметров. Данные, уже записанные в строке, не нужно дублировать в типах.
