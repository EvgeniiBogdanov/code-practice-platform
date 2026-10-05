// Что выведет данный код в консоль и почему?
// Если строка бросает ошибку — напишите имя ошибки.

if (true) {
  var a = 1;
  let b = 2;
  const c = 3;
}

console.log(a);
console.log(typeof b);
console.log(typeof c);

var x = 10;
var x = 20;
console.log(x);

const user = { name: "Анна" };
user.name = "Мария";
console.log(user.name);

const numbers = [1, 2];
numbers.push(3);
console.log(numbers.length);

try {
  const limit = 5;
  limit = 10;
} catch (error) {
  console.log(error.name);
}

for (var i = 0; i < 3; i++) {}
console.log(i);

for (let j = 0; j < 3; j++) {}
console.log(typeof j);
