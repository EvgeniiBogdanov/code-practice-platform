const obj = {};
const map = new Map();

const key1 = { id: 1 };
const key2 = { id: 2 };

// Ключи обычного объекта — только строки и символы.
// Оба объекта приводятся к одной строке "[object Object]", вторая запись перезаписывает первую.
obj[key1] = "first";
obj[key2] = "second";

// Map хранит ключ как есть и сравнивает объекты по ссылке
map.set(key1, "first");
map.set(key2, "second");

console.log(obj[key1]); // "second"
console.log(Object.keys(obj)); // ["[object Object]"]
console.log(map.get(key1)); // "first"
console.log(map.size); // 2

// Число 1 как ключ объекта превращается в строку "1"
obj[1] = "number";
obj["1"] = "string";

// В Map 1 и "1" — разные ключи
map.set(1, "number");
map.set("1", "string");

console.log(obj[1]); // "string"
console.log(map.get(1)); // "number"
console.log(map.get("1")); // "string"
