// Что выведет данный код в консоль и почему?
// Если строка бросает ошибку — напишите имя ошибки.

console.log(typeof declared);
console.log(typeof expressed);

function declared() {
  return "declaration";
}

var expressed = function () {
  return "expression";
};

console.log(typeof expressed);

const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};
console.log(factorial(5));
console.log(typeof fact);

const regular = function () {
  return arguments.length;
};
const arrow = (...args) => args.length;
console.log(regular(1, 2, 3));
console.log(arrow(1, 2));

const Person = function (name) {
  this.name = name;
};
const ArrowPerson = (name) => {
  this.name = name;
};
console.log(new Person("Анна").name);

try {
  new ArrowPerson("Олег");
} catch (error) {
  console.log(error.name);
}
