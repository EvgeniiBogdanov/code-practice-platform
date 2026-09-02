// Что выведет данный код в консоль и почему?

const set = new Set();
set.add(1);
set.add(5);
set.add("five");
set.add(5);

console.log(set.size);
console.log(set.has(5));
console.log(set.has("5"));
