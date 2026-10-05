// Реализация оператора instanceof
// Напишите функцию myInstanceof(value, Constructor), которая проверяет,
// есть ли Constructor.prototype в цепочке прототипов value.
// Для примитивов функция должна возвращать false.

const myInstanceof = (value, Constructor) => {
  // Решение тут
};

// Пример вызова:
class Animal {}
class Dog extends Animal {}
const dog = new Dog();

console.log(myInstanceof([], Array)); // true
console.log(myInstanceof([], Object)); // true
console.log(myInstanceof({}, Array)); // false
console.log(myInstanceof(dog, Dog)); // true
console.log(myInstanceof(dog, Animal)); // true
console.log(myInstanceof(42, Number)); // false
console.log(myInstanceof(Object.create(null), Object)); // false
console.log(myInstanceof(() => {}, Function)); // true
