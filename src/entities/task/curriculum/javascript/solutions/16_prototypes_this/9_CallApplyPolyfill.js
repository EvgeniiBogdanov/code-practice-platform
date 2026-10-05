Function.prototype.myCall = function (context, ...args) {
  // this — функция, у которой вызвали myCall
  const target = context === null || context === undefined ? globalThis : Object(context);

  // Уникальный Symbol не перезапишет существующее свойство объекта
  const fnKey = Symbol("fn");
  target[fnKey] = this;

  try {
    // Вызов «через точку» — неявная привязка this к target
    return target[fnKey](...args);
  } finally {
    delete target[fnKey]; // убираем следы даже при исключении
  }
};

Function.prototype.myApply = function (context, args = []) {
  return this.myCall(context, ...args);
};

// Пример вызова:
function introduce(greeting, punctuation) {
  return `${greeting}, я ${this.name}${punctuation}`;
}

const anna = { name: "Анна" };
console.log(introduce.myCall(anna, "Привет", "!")); // "Привет, я Анна!"
console.log(introduce.myApply({ name: "Олег" }, ["Здравствуйте", "."])); // "Здравствуйте, я Олег."
console.log(Reflect.ownKeys(anna)); // ["name"]
console.log(Math.max.myApply(null, [3, 7, 2])); // 7
console.log(introduce.myApply({ name: "Ия" })); // "undefined, я Ияundefined"
