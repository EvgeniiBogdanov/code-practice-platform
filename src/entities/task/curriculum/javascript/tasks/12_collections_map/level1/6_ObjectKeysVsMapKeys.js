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
console.log(Object.keys(obj));
console.log(map.get(key1));
console.log(map.size);

obj[1] = "number";
obj["1"] = "string";

map.set(1, "number");
map.set("1", "string");

console.log(obj[1]);
console.log(map.get(1));
console.log(map.get("1"));
