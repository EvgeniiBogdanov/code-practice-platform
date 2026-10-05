function myNew(Constructor, ...args) {
  // 1. Пустой объект с прототипом Constructor.prototype
  const instance = Object.create(Constructor.prototype);

  // 2. Вызываем конструктор с this = instance
  const result = Constructor.apply(instance, args);

  // 3. Объект или функция из конструктора заменяют instance; примитивы игнорируются
  const returnsObject =
    result !== null && (typeof result === "object" || typeof result === "function");

  return returnsObject ? result : instance;
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
