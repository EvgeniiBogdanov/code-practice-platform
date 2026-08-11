// Сравнение объектов в Set
// Что выведет данный код?

const a = { x: 1 };
const b = { x: 1 };

const set = new Set();
set.add(a);
set.add(b);

console.log(set.size);
console.log(set.has(a));
console.log(set.has({ x: 1 }));
