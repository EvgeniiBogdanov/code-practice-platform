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

// 1. Простой вызов: в строгом режиме this === undefined (в нестрогом — globalThis)
console.log(showThis()); // undefined

// 2. Неявная привязка: this — объект слева от точки
console.log(user.showThis() === user); // true
console.log(user.getName()); // "Анна"

// 3. Явная привязка: call и apply вызывают сразу, bind возвращает новую функцию
console.log(user.getName.call({ name: "Админ" })); // "Админ"
console.log(user.getName.apply({ name: "Гость" })); // "Гость"
const bound = user.getName.bind({ name: "Привязанный" });
console.log(bound()); // "Привязанный"

// 4. new: this — новый пустой объект
function Person(name) {
  this.name = name;
}
console.log(new Person("Олег").name); // "Олег"

// Потеря контекста: вызов без точки — это простой вызов, this === undefined
const getName = user.getName;
console.log(getName()); // undefined

// new игнорирует привязанный через bind this
const BoundPerson = Person.bind({ name: "Игнорируется" });
console.log(new BoundPerson("Мария").name); // "Мария"
