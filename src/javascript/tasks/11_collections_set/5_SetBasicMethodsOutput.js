// Что выведет данный код?

const set = new Set();

set.add(1);
set.add(2);
set.add(2);
set.add(3);

console.log(set.size);
console.log(set.has(2));
set.delete(2);
console.log(set.has(2));
set.clear();
console.log(set.size);
