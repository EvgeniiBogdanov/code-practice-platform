// Реализация оператора instanceof (customInstanceOf)
// Напишите функцию customInstanceOf(obj, constructor), которая проверяет, присутствует ли свойство prototype конструктора в цепочке прототипов объекта obj.

function customInstanceOf(obj, constructor) {
  // Решение тут
}

// Пример вызова:
class Animal {}
class Dog extends Animal {}

const d = new Dog();
console.log(customInstanceOf(d, Dog));    // true
console.log(customInstanceOf(d, Animal)); // true
console.log(customInstanceOf(d, Array));  // false
