// Что выведет данный код в консоль и почему?

const proto = { inherited: 1 };
const child = Object.create(proto);
child.own = 2;

console.log("own" in child);
console.log("inherited" in child);
console.log(child.hasOwnProperty("own"));
console.log(child.hasOwnProperty("inherited"));
