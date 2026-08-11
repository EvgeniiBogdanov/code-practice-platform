const proto = { inherited: true };
const obj = Object.create(proto);
obj.own = 123;

console.log("own" in obj);                    // true
console.log("inherited" in obj);              // true
console.log(Object.hasOwn(obj, "own"));       // true
console.log(Object.hasOwn(obj, "inherited")); // false
