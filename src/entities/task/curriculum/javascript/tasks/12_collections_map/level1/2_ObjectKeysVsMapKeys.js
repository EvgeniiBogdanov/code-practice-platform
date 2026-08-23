// Разница ключей в Object и Map
// Что выведет данный код?

const obj = {};
const map = new Map();

obj[1] = "num";
obj["1"] = "str";

map.set(1, "num");
map.set("1", "str");

console.log(Object.keys(obj).length);
console.log(map.size);
