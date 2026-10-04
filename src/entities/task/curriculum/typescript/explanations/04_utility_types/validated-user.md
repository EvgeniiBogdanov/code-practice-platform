# Разбор задачи: «Результат валидации»

## 1. Что дано

`validateUser` проверяет имя и возраст. Без типов результат функции — объединение двух объектных литералов, которое TypeScript выводит неточно, а `errors = {}` вообще не позволяет добавлять поля: `Property 'name' does not exist on type '{}'`.

## 2. Что нужно получить

- Успех: `{ ok: true, user: User }`.
- Неудача: `{ ok: false, errors: ... }` с сообщением для каждого проблемного поля.
- После `if (result.ok)` доступен `result.user`, в ветке `else` — `result.errors`.

## 3. Почему не Partial<User>

Первое, что приходит в голову, — вернуть `Partial<User>` и класть в него только прошедшие проверку поля. Но тогда:

- вызывающий код не знает, прошла ли проверка, и должен сам проверять каждое поле;
- нет информации о причинах ошибок;
- неполного пользователя легко случайно передать дальше как настоящего.

Результат проверки — это **один из двух исходов**. Такие данные описывают дискриминируемым объединением.

## 4. Решение по шагам

### Шаг 1. Тип ошибок из модели

```ts
type ValidationErrors = Partial<Record<keyof User, string>>;
// { name?: string; age?: string }
```

- `keyof User` — `"name" | "age"`;
- `Record<..., string>` — объект с сообщением для каждого поля;
- `Partial` — ошибка есть не у каждого поля.

Ключи ошибок привязаны к модели: добавили поле в `User` — его можно указать в ошибках, опечатка `errors.nmae` — ошибка компиляции.

### Шаг 2. Результат — объединение с дискриминатором

```ts
type ValidationResult =
  | { ok: true; user: User }
  | { ok: false; errors: ValidationErrors };
```

Поле `ok` с литеральными типами `true` и `false` — дискриминатор. Проверка `if (result.ok)` сужает результат до нужного варианта.

### Шаг 3. Аннотировать errors и результат

`const errors: ValidationErrors = {}` разрешает добавлять известные поля. Возвращаемый тип `ValidationResult` проверяет, что оба `return` соответствуют своим вариантам.

### Полный код

```ts
type ValidationErrors = Partial<Record<keyof User, string>>;

type ValidationResult =
  | { ok: true; user: User }
  | { ok: false; errors: ValidationErrors };

const validateUser = (name: string, age: number): ValidationResult => {
  const errors: ValidationErrors = {};

  if (name.trim().length === 0) {
    errors.name = "Имя не может быть пустым";
  }

  if (age < 18) {
    errors.age = "Пользователь должен быть совершеннолетним";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, user: { name, age } };
};
```

## 5. Как это работает при вызове

| Вызов | Результат | Что доступно |
| --- | --- | --- |
| `validateUser("Alice", 30)` | `{ ok: true, user: {...} }` | `result.user` |
| `validateUser("", 30)` | `{ ok: false, errors: { name: "..." } }` | `result.errors` |
| `validateUser("", 12)` | ошибки обоих полей | `result.errors.name`, `result.errors.age` |

Обращение к `result.user` без проверки `ok` — ошибка компиляции: в варианте неудачи этого поля нет.

## 6. Паттерн Result

Тот же подход применяют для любых операций, которые могут ожидаемо не удаться: парсинг, валидация форм, запросы. Обобщённая версия:

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
```

В отличие от `throw`, ошибка видна в сигнатуре, и TypeScript заставляет обработать обе ветки.

## 7. Частые ошибки

- Сделать `user?` и `errors?` необязательными полями одного объекта: появляются невозможные состояния вроде `{ ok: true, errors: {...} }`.
- Типизировать `ok` как `boolean`: тогда сужение не работает.
- Описать ошибки как `Record<string, string>` и потерять связь с полями модели.

## 8. Что запомнить

Утилиты удобно комбинировать: `Partial<Record<keyof User, string>>` строит тип ошибок из модели. А результат с несколькими исходами описывается дискриминируемым объединением, а не частично заполненным объектом.
