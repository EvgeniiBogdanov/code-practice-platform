# Разбор задачи: «Partial, Required, Readonly и NonNullable»

## 1. Что дано

Типичный сценарий: пользователь передаёт часть настроек, остальное берётся из значений по умолчанию. Нужно описать четыре разных преобразования одной модели, не копируя её поля вручную.

## 2. Что нужно получить

| Требование | Утилита | Результат |
| --- | --- | --- |
| вход: любые поля `Options` | `Partial<Options>` | все поля необязательны |
| результат нельзя менять | `Readonly<Options>` | все поля `readonly` |
| все поля `LegacyOptions` обязательны | `Required<LegacyOptions>` | `?` снят со всех полей |
| ключ без `null` и `undefined` | `NonNullable<RawKey>` | `string \| number` |

## 3. Как устроены утилиты

Все четыре — короткие типы из стандартной библиотеки:

```ts
type Partial<T> = { [P in keyof T]?: T[P] };
type Required<T> = { [P in keyof T]-?: T[P] };
type Readonly<T> = { readonly [P in keyof T]: T[P] };
type NonNullable<T> = T & {};
```

Первые три — отображаемые типы (mapped types): они проходят по всем ключам `T` и добавляют или снимают модификатор. Реализовать их самостоятельно — отдельная задача в разделе преобразований.

## 4. Решение по шагам

### Шаг 1. Вход и выход resolveOptions

```ts
type ResolvedOptions = Readonly<Options>;

const resolveOptions = (options: Partial<Options>): ResolvedOptions => {
  return { ...DEFAULT_OPTIONS, ...options };
};
```

`Partial<Options>` разрешает `{}`, `{ retries: 5 }` и любую комбинацию полей. Результат спреда содержит все поля, поэтому подходит к `Readonly<Options>`. Попытка `resolved.retries = 10` — ошибка компиляции.

`DEFAULT_OPTIONS` тоже аннотирован: если в `Options` появится новое поле, TypeScript потребует добавить его значение по умолчанию.

### Шаг 2. Required для чужой модели

```ts
type StrictLegacyOptions = Required<LegacyOptions>; // { host: string; port: number }
```

Модификатор `-?` снимает необязательность и убирает `undefined`, который она добавляла.

### Шаг 3. NonNullable для объединения

```ts
type CacheKey = NonNullable<RawKey>; // string | number
```

### Полный код

```ts
type ResolvedOptions = Readonly<Options>;

const DEFAULT_OPTIONS: ResolvedOptions = { timeout: 5000, retries: 3, baseUrl: "/" };

const resolveOptions = (options: Partial<Options>): ResolvedOptions => {
  return { ...DEFAULT_OPTIONS, ...options };
};

type StrictLegacyOptions = Required<LegacyOptions>;
type CacheKey = NonNullable<RawKey>;
```

## 5. Ловушка спреда и явного undefined

```ts
resolveOptions({ timeout: undefined });
```

`Partial` разрешает явное `undefined` в необязательном поле. Спред скопирует его поверх значения по умолчанию, и `timeout` станет `undefined`, хотя тип результата обещает `number`. Решения:

- флаг `exactOptionalPropertyTypes`: необязательное поле можно пропустить, но нельзя явно передать `undefined`;
- явная подстановка: `timeout: options.timeout ?? DEFAULT_OPTIONS.timeout`.

Об этой разнице между «поля нет» и «поле равно undefined» часто спрашивают на собеседованиях.

## 6. Частые ошибки

- Ожидать, что `Readonly` защитит вложенные объекты. Он поверхностный, как и `Partial`.
- Ожидать, что `Readonly` заморозит объект во время выполнения. Это только проверка типов.
- Копировать поля `Options` в отдельный интерфейс `OptionalOptions` вместо `Partial`.

## 7. Что запомнить

`Partial`, `Required` и `Readonly` переключают модификаторы всех полей, `NonNullable` убирает `null` и `undefined` из объединения. Все утилиты поверхностные и действуют только на этапе проверки типов.
