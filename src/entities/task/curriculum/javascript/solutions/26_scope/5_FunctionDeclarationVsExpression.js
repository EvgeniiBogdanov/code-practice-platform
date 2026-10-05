console.log(typeof declared); // "function" — Function Declaration поднята целиком
console.log(typeof expressed); // "undefined" — поднята только переменная var

function declared() {
  return "declaration";
}

var expressed = function () {
  return "expression";
};

console.log(typeof expressed); // "function"

// Named Function Expression: имя fact видно только внутри самой функции
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};
console.log(factorial(5)); // 120
console.log(typeof fact); // "undefined"

// У обычной функции есть arguments, у стрелочной — нет (используйте rest)
const regular = function () {
  return arguments.length;
};
const arrow = (...args) => args.length;
console.log(regular(1, 2, 3)); // 3
console.log(arrow(1, 2)); // 2

// Обычную функцию можно вызвать через new, стрелочную — нельзя
const Person = function (name) {
  this.name = name;
};
const ArrowPerson = (name) => {
  this.name = name;
};
console.log(new Person("Анна").name); // "Анна"

try {
  new ArrowPerson("Олег");
} catch (error) {
  console.log(error.name); // "TypeError": ArrowPerson is not a constructor
}
