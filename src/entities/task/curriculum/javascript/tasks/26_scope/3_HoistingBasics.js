// Что выведет данный код в консоль и почему?
// Если строка бросает ошибку — напишите имя ошибки.

console.log(a);
var a = 5;
console.log(a);

sayHi();

function sayHi() {
  console.log("Привет из функции");
}

console.log(typeof greet);
var greet = function () {
  console.log("Привет из выражения");
};

try {
  helper();
} catch (error) {
  console.log(error.name);
}
var helper = () => console.log("helper");
