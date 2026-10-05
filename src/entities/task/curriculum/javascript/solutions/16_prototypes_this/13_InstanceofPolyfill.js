const myInstanceof = (value, Constructor) => {
  // У примитивов нет цепочки прототипов в смысле instanceof
  const isObject = value !== null && (typeof value === "object" || typeof value === "function");
  if (!isObject) {
    return false;
  }

  // Поднимаемся по цепочке, пока не дойдём до null
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Constructor.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }

  return false;
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
