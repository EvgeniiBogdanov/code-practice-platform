const user = { id: 1, name: "Ann" };
const set = new Set();

set.add(user);
user.name = "Bob";

console.log(set.has(user)); // true
console.log([...set]);      // [{ id: 1, name: "Bob" }]
