// Полифил Function.prototype.bind
// Реализуйте метод myBind(context, ...presetArgs):
// - возвращает новую функцию с привязанным this и частично применёнными аргументами;
// - вызов через call/apply и повторный myBind не меняют привязанный this (как у встроенного bind);
// - если привязанную функцию вызвать через new, this должен указывать на новый объект,
//   а предустановленные аргументы — сохраниться.
// Встроенный bind использовать нельзя, call и apply — можно.

Function.prototype.myBind = function (context, ...presetArgs) {
  // Решение тут
};

// Пример вызова:
const user = { name: "Анна" };
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const boundGreet = greet.myBind(user, "Привет");
console.log(boundGreet("!")); // "Привет, Анна!"
console.log(boundGreet.call({ name: "Олег" }, "?")); // "Привет, Анна?"

const rebound = boundGreet.myBind({ name: "Мария" });
console.log(rebound("!")); // "Привет, Анна!"

function Point(x, y) {
  this.x = x;
  this.y = y;
}
const BoundPoint = Point.myBind({ ignored: true }, 10);
const point = new BoundPoint(20);
console.log(point.x, point.y); // 10 20
console.log(point instanceof Point); // true
console.log(point.ignored); // undefined
