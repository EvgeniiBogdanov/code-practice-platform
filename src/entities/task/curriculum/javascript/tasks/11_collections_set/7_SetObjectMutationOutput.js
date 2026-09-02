// Что выведет данный код в консоль и почему?

const set = new Set();
const user = { name: "Alice" };

set.add(user);
user.name = "Bob";

console.log(set.has(user));
console.log(Array.from(set)[0].name);
