// Реализация полифила Function.prototype.bind
// Реализуйте метод customBind(context, ...args) на Function.prototype.

Function.prototype.customBind = function (context, ...boundArgs) {
  // Решение тут
};

// Пример вызова:
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const user = { name: "Alice" };
const greetAlice = greet.customBind(user, "Hello");
console.log(greetAlice("!")); // "Hello, Alice!"
