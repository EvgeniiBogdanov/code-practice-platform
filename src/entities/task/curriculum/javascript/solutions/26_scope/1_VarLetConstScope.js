if (true) {
  var a = 1; // var игнорирует блок: переменная видна во всей функции
  let b = 2; // let и const живут только внутри фигурных скобок
  const c = 3;
}

console.log(a); // 1
console.log(typeof b); // "undefined" — b не существует снаружи блока
console.log(typeof c); // "undefined"

var x = 10;
var x = 20; // var разрешает повторное объявление (let/const — SyntaxError)
console.log(x); // 20

const user = { name: "Анна" };
user.name = "Мария"; // const запрещает переприсваивание, но не мутацию объекта
console.log(user.name); // "Мария"

const numbers = [1, 2];
numbers.push(3);
console.log(numbers.length); // 3

try {
  const limit = 5;
  limit = 10; // переприсваивание константы
} catch (error) {
  console.log(error.name); // "TypeError"
}

for (var i = 0; i < 3; i++) {}
console.log(i); // 3 — var «протекает» из цикла

for (let j = 0; j < 3; j++) {}
console.log(typeof j); // "undefined" — let живёт только внутри цикла
