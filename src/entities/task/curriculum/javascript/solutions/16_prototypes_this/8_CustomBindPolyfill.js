const customBind = (fn, context, ...boundArgs) => {
  if (typeof fn !== "function") {
    throw new TypeError("customBind: first argument must be a function");
  }

  return function (...callArgs) {
    return fn.apply(context, [...boundArgs, ...callArgs]);
  };
};

// Пример вызова:
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const user = { name: "Алексей" };
const boundGreet = customBind(greet, user, "Привет");

console.log(boundGreet("!")); // 'Привет, Алексей!'
console.log(boundGreet("?")); // 'Привет, Алексей?'

function add(a, b, c) {
  return a + b + c;
}
const add5 = customBind(add, null, 2, 3);
console.log(add5(4)); // 9
