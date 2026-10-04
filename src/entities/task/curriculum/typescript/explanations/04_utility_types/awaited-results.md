# Разбор задачи: «Awaited и типы асинхронного кода»

## 1. Что дано

Функции загрузки и класс клиента уже существуют, и их типы выведены из реализации. Нужно получить производные типы, не копируя поля вручную: если в `fetchUser` появится поле `email`, тип `User` должен обновиться сам.

## 2. Что нужно получить

| Тип | Откуда | Ожидаемый результат |
| --- | --- | --- |
| `User` | результат `fetchUser` после `await` | `{ id: number; name: string; roles: string[] }` |
| `Dashboard` | результат `loadDashboard` после `await` | кортеж `[User, Order[]]` |
| `ClientOptions` | первый аргумент конструктора `ApiClient` | `{ baseUrl: string; timeout: number }` |

## 3. Шаг за шагом от значения к типу

### typeof — из значения в тип

`fetchUser` — значение. Утилиты принимают типы, поэтому сначала `typeof fetchUser`: `(id: number) => Promise<{ ... }>`.

### ReturnType — результат функции

`ReturnType<typeof fetchUser>` — `Promise<{ id: number; name: string; roles: string[] }>`. Для async-функции это всегда `Promise`.

### Awaited — значение после await

```ts
type User = Awaited<ReturnType<typeof fetchUser>>;
```

`Awaited` снимает обёртку `Promise` так же, как это делает `await`, причём рекурсивно: `Awaited<Promise<Promise<number>>>` — это `number`. Он также понимает любые thenable-объекты с методом `then`.

## 4. Dashboard и типы Promise.all

```ts
type Dashboard = Awaited<ReturnType<typeof loadDashboard>>;
// [{ id: number; name: string; roles: string[] }, { id: number; userId: number; total: number }[]]
```

Результат — **кортеж**, а не массив объединения. Так объявлен `Promise.all`:

```ts
all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;
```

`| []` в ограничении заставляет TypeScript выводить кортеж для литерала массива, а отображаемый тип применяет `Awaited` к каждой позиции. Поэтому при деструктуризации `[user, orders]` каждая переменная получает свой тип.

## 5. ConstructorParameters для классов

```ts
type ClientOptions = ConstructorParameters<typeof ApiClient>[0];
```

`typeof ApiClient` — тип самого класса как значения, то есть конструктора. `ConstructorParameters` возвращает кортеж аргументов `new`, а `[0]` выбирает первый. Парная утилита `InstanceType<typeof ApiClient>` даёт тип экземпляра; она нужна, когда класс передают как значение, например в фабрику или DI-контейнер.

### Полный код

```ts
type User = Awaited<ReturnType<typeof fetchUser>>;
type Dashboard = Awaited<ReturnType<typeof loadDashboard>>;
type ClientOptions = ConstructorParameters<typeof ApiClient>[0];

const printDashboard = ([user, orders]: Dashboard): void => {
  console.log(`${user.name}: ${orders.length} заказ(ов)`);
};
```

## 6. Когда выводить, а когда описывать

Вывод типов из реализации удобен, когда функция — источник истины: клиент API, фабрика, конфиг. Но он связывает тип с деталями реализации: случайное изменение функции молча изменит тип для всего проекта. Публичные контракты, например модели API, надёжнее описывать явно и аннотировать ими функции.

## 7. Частые ошибки

- Писать `ReturnType<fetchUser>`: `fetchUser` — значение, нужен `typeof`.
- Забыть `Awaited` и получить `Promise<User>`.
- Ожидать массив `(User | Order[])[]` от `Promise.all` и типизировать деструктуризацию вручную.
- Использовать `InstanceType<ApiClient>`: `ApiClient` в позиции типа — уже тип экземпляра, а утилите нужен тип конструктора `typeof ApiClient`.

## 8. Что запомнить

Цепочка `Awaited<ReturnType<typeof fn>>` — стандартный способ получить тип результата асинхронной функции. `typeof` переводит значение в тип, `ReturnType`, `Parameters`, `ConstructorParameters` и `InstanceType` разбирают сигнатуры, а `Awaited` снимает `Promise`.
