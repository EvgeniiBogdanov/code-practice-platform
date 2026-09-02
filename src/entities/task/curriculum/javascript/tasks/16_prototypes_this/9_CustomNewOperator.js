// Реализация эмуляции оператора new (customNew)
// Напишите функцию customNew(Constructor, ...args), воспроизводящую поведение оператора new в JavaScript.
//
// Требования:
// 1. Создает новый пустой объект с прототипом Constructor.prototype.
// 2. Вызывает функцию Constructor с контекстом созданного объекта и переданными аргументами.
// 3. Если конструктор вернул объект — возвращает его, иначе возвращает созданный объект.

function customNew(Constructor, ...args) {
  // Решение тут
}

// Пример вызова:
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHi = function () {
  return `Привет, я ${this.name}`;
};

const john = customNew(Person, "John", 30);
console.log(john.name); // "John"
console.log(john.age);  // 30
console.log(john.sayHi()); // "Привет, я John"
