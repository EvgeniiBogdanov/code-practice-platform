type Simplify<T> = { [K in keyof T]: T[K] };

class FormBuilder<Fields extends object> {
  private constructor(private readonly values: Fields) {}

  static create(): FormBuilder<Record<never, never>> {
    return new FormBuilder({});
  }

  // Exclude превращает имя уже существующего поля в never, и вызов не компилируется.
  field<Name extends string, Value>(
    name: Exclude<Name, keyof Fields>,
    initialValue: Value
  ): FormBuilder<Fields & Record<Name, Value>> {
    // Для вычисляемого ключа обобщённого типа TypeScript выводит индексную сигнатуру
    // { [x: string]: Value }, поэтому точный тип записи указываем явно.
    const entry = { [name]: initialValue } as Record<Name, Value>;
    return new FormBuilder({ ...this.values, ...entry });
  }

  build(): Simplify<Fields> {
    return this.values;
  }
}

const form = FormBuilder.create()
  .field("email", "")
  .field("age", 18)
  .field("subscribe", false)
  .build();
// { email: string; age: number; subscribe: boolean }

console.log(form.email.trim(), form.age.toFixed(0), form.subscribe);
// form.phone; // Ошибка: такого поля нет
// FormBuilder.create().field("email", "").field("email", ""); // Ошибка: поле уже добавлено
