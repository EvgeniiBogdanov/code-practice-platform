// Разница между Object.hasOwn и оператором in
// Что выведет данный код?

const proto = { inherited: true };
const obj = Object.create(proto);
obj.own = 123;

console.log("own" in obj);
console.log("inherited" in obj);
console.log(Object.hasOwn(obj, "own"));
console.log(Object.hasOwn(obj, "inherited"));
