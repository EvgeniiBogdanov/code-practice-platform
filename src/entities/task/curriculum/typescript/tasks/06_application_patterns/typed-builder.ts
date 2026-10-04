// Реализуйте класс FormBuilder с методом field(name, initialValue),
// который можно вызывать цепочкой. Метод build() должен возвращать
// объект, тип которого точно отражает все добавленные поля:
//
// const form = FormBuilder.create()
//   .field("email", "")
//   .field("age", 18)
//   .field("subscribe", false)
//   .build();
//
// form.email — string, form.age — number, form.subscribe — boolean,
// form.phone — ошибка типизации.
// Повторное добавление уже существующего поля тоже должно быть ошибкой.

class FormBuilder {
  values = {};

  static create() {
    return new FormBuilder();
  }

  field(name, initialValue) {
    this.values[name] = initialValue;
    return this;
  }

  build() {
    return this.values;
  }
}

const form = FormBuilder.create()
  .field("email", "")
  .field("age", 18)
  .field("subscribe", false)
  .build();

form.phone; // должно быть ошибкой
FormBuilder.create().field("email", "").field("email", ""); // должно быть ошибкой
