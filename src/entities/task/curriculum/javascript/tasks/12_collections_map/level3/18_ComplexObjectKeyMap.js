// Что выведет данный код в консоль и почему?

const map = new Map();
const obj1 = { id: 1 };
const obj2 = { id: 1 };

map.set(obj1, "User 1");
map.set(obj2, "User 2");

console.log(map.size);
console.log(map.get(obj1));
console.log(map.get({ id: 1 }));
