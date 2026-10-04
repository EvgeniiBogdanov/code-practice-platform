# Разбор задачи: «Типобезопасный builder»

## 1. Что дано

Builder с цепочкой вызовов `field(...)`. В JavaScript он работает, но результат `build()` — `{}` без информации о полях. Нужно, чтобы тип **накапливался** с каждым вызовом.

## 2. Что нужно получить

| Шаг | Тип builder'а |
| --- | --- |
| `FormBuilder.create()` | `FormBuilder<{}>` |
| `.field("email", "")` | `FormBuilder<{ email: string }>` |
| `.field("age", 18)` | `FormBuilder<{ email: string } & { age: number }>` |
| `.build()` | `{ email: string; age: number; ... }` |
| `.field("email", ...)` повторно | ошибка |

## 3. Идея: параметр типа хранит накопленные поля

Класс параметризуется типом уже добавленных полей `Fields`. Каждый вызов `field` возвращает builder **с новым параметром**: старые поля плюс новое.

```ts
field<Name extends string, Value>(name: ..., initialValue: Value): FormBuilder<Fields & Record<Name, Value>>
```

- `Name extends string` — ограничение строкой сохраняет литерал `"email"`, а не расширяет его до `string`.
- `Value` выводится из начального значения: `""` → `string`, `18` → `number`.
- `Fields & Record<Name, Value>` — пересечение добавляет поле к накопленным.

## 4. Почему новый экземпляр, а не return this

Тип `this` у экземпляра один и не меняется. Чтобы каждый шаг имел свой тип, `field` возвращает новый `FormBuilder` с новым параметром. Заодно builder становится неизменяемым: промежуточный builder можно переиспользовать для разных форм.

Конструктор сделан `private`, а пустой builder создаётся через `FormBuilder.create()`. Так стартовый тип `Record<never, never>` (объект без полей) задаётся в одном месте.

## 5. Запрет повторного поля

```ts
name: Exclude<Name, keyof Fields>
```

TypeScript выводит `Name` из аргумента, например `"email"`, а затем проверяет аргумент по типу `Exclude<"email", keyof Fields>`. Если `email` уже есть в `Fields`, результат — `never`, и строку `"email"` передать нельзя. Если поля нет — тип остаётся `"email"`, и вызов компилируется.

## 6. Единственное утверждение типа

```ts
const entry = { [name]: initialValue } as Record<Name, Value>;
```

Для вычисляемого ключа обобщённого типа TypeScript выводит индексную сигнатуру `{ [x: string]: Value }` вместо `Record<Name, Value>`. Это давнее ограничение компилятора, а не ошибка в логике: во время выполнения объект действительно содержит ровно один ключ `name`. Утверждение изолировано в одной строке, а снаружи API полностью типобезопасен. В типовом программировании это нормальная практика: точный фасад и небольшое, объяснённое утверждение внутри реализации.

## 7. Simplify для читаемого результата

Без обработки тип формы выглядит как `Record<never, never> & Record<"email", string> & Record<"age", number> & ...`. Отображаемый тип `Simplify<T> = { [K in keyof T]: T[K] }` разворачивает пересечение в один объект, и подсказка в редакторе показывает `{ email: string; age: number; subscribe: boolean }`.

### Полный код

```ts
type Simplify<T> = { [K in keyof T]: T[K] };

class FormBuilder<Fields extends object> {
  private constructor(private readonly values: Fields) {}

  static create(): FormBuilder<Record<never, never>> {
    return new FormBuilder({});
  }

  field<Name extends string, Value>(
    name: Exclude<Name, keyof Fields>,
    initialValue: Value
  ): FormBuilder<Fields & Record<Name, Value>> {
    const entry = { [name]: initialValue } as Record<Name, Value>;
    return new FormBuilder({ ...this.values, ...entry });
  }

  build(): Simplify<Fields> {
    return this.values;
  }
}
```

## 8. Где встречается этот приём

- построители SQL-запросов (Kysely, Drizzle): `select("id").from("users")` знает тип результата;
- схемы валидации: `z.object({...}).extend({...})`;
- tRPC и роутеры с накоплением middleware-контекста.

## 9. Частые ошибки

- Возвращать `this` и пытаться менять тип через `as`.
- Объявлять `Name` без ограничения `extends string`: литерал расширится, и все поля сольются в индексную сигнатуру.
- Мутировать общий объект `values` между шагами: промежуточный builder перестаёт быть независимым.

## 10. Что запомнить

Параметр типа класса может накапливать информацию: каждый вызов возвращает builder с расширенным параметром. `Exclude` в позиции параметра запрещает повторы, а `Simplify` делает итоговый тип читаемым.
