// Что выведет данный код в консоль и почему?

const sym = Symbol("secret");
const obj = {
  regular: "visible",
  [sym]: "hidden",
};

Object.defineProperty(obj, "nonEnum", {
  value: 42,
  enumerable: false,
});

console.log(Object.keys(obj));
console.log(Object.getOwnPropertyNames(obj));
console.log(Object.getOwnPropertySymbols(obj));
console.log(Reflect.ownKeys(obj));
