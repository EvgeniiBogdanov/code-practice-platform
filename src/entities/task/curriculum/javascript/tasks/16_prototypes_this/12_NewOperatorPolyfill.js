// Реализация оператора new
// Напишите функцию myNew(Constructor, ...args), которая повторяет поведение new:
// 1. создаёт новый объект, прототипом которого является Constructor.prototype;
// 2. вызывает Constructor с this = новый объект и переданными аргументами;
// 3. если конструктор вернул объект (или функцию) — возвращает его, иначе — созданный объект.

function myNew(Constructor, ...args) {
  // Решение тут
}

// Пример вызова:
function User(name) {
  this.name = name;
}
User.prototype.sayHi = function () {
  return `Привет, я ${this.name}`;
};

const anna = myNew(User, "Анна");
console.log(anna.name); // "Анна"
console.log(anna.sayHi()); // "Привет, я Анна"
console.log(anna instanceof User); // true

function WithObjectReturn() {
  this.a = 1;
  return { b: 2 };
}
const withObject = myNew(WithObjectReturn);
console.log(withObject.a, withObject.b); // undefined 2

function WithPrimitiveReturn() {
  this.a = 1;
  return 42;
}
console.log(myNew(WithPrimitiveReturn).a); // 1
