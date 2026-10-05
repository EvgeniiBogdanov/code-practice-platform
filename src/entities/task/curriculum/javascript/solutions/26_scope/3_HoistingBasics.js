// Движок сначала «регистрирует» объявления, а потом выполняет код построчно.
// var a поднимается и сразу получает значение undefined.
console.log(a); // undefined
var a = 5;
console.log(a); // 5

// Function Declaration поднимается целиком — вместе с телом.
sayHi(); // "Привет из функции"

function sayHi() {
  console.log("Привет из функции");
}

// var greet поднят, но присваивание функции ещё не выполнено.
console.log(typeof greet); // "undefined"
var greet = function () {
  console.log("Привет из выражения");
};

try {
  helper(); // helper === undefined, вызвать undefined нельзя
} catch (error) {
  console.log(error.name); // "TypeError" (не ReferenceError!)
}
var helper = () => console.log("helper");
