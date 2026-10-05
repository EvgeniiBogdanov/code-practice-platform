// Что выведет данный код в консоль и почему?
// Код выполняется в строгом режиме ("use strict"), как в ES-модулях и классах.

function showThis() {
  return this;
}

const user = {
  name: "Анна",
  showThis,
  getName() {
    return this?.name;
  },
};

// 1. Простой вызов функции
console.log(showThis());

// 2. Вызов как метода объекта
console.log(user.showThis() === user);
console.log(user.getName());

// 3. Явная привязка: call, apply, bind
console.log(user.getName.call({ name: "Админ" }));
console.log(user.getName.apply({ name: "Гость" }));
const bound = user.getName.bind({ name: "Привязанный" });
console.log(bound());

// 4. Вызов через new
function Person(name) {
  this.name = name;
}
console.log(new Person("Олег").name);

// Потеря контекста: метод сохранили в переменную
const getName = user.getName;
console.log(getName());

// Приоритет правил: new сильнее bind
const BoundPerson = Person.bind({ name: "Игнорируется" });
console.log(new BoundPerson("Мария").name);
