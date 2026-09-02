// Что выведет данный код в консоль и почему?

const obj = {};
const map = new Map();

const key1 = { id: 1 };
const key2 = { id: 2 };

obj[key1] = "first";
obj[key2] = "second";

map.set(key1, "first");
map.set(key2, "second");

console.log(obj[key1]);
console.log(map.get(key1));
