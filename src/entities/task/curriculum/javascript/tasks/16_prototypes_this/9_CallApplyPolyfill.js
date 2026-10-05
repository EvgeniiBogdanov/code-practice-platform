// Полифилы Function.prototype.call и Function.prototype.apply
// Реализуйте методы myCall(context, ...args) и myApply(context, argsArray), которые вызывают
// функцию с заданным this, не используя встроенные call, apply и bind.
// Если context равен null или undefined, используйте globalThis.
// После вызова объект context не должен содержать никаких новых свойств.

Function.prototype.myCall = function (context, ...args) {
  // Решение тут
};

Function.prototype.myApply = function (context, args) {
  // Решение тут
};

// Пример вызова:
function introduce(greeting, punctuation) {
  return `${greeting}, я ${this.name}${punctuation}`;
}

const anna = { name: "Анна" };
console.log(introduce.myCall(anna, "Привет", "!")); // "Привет, я Анна!"
console.log(introduce.myApply({ name: "Олег" }, ["Здравствуйте", "."])); // "Здравствуйте, я Олег."
console.log(Reflect.ownKeys(anna)); // ["name"] — временное свойство удалено
console.log(Math.max.myApply(null, [3, 7, 2])); // 7
console.log(introduce.myApply({ name: "Ия" })); // "undefined, я Ияundefined"
