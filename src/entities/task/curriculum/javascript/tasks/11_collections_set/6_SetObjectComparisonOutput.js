// Что выведет данный код в консоль и почему?

const set = new Set();
const obj = { id: 1 };

set.add(obj);
set.add({ id: 1 });

console.log(set.size);
console.log(set.has(obj));
console.log(set.has({ id: 1 }));
