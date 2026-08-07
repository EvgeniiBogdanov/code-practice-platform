const user = { id: 1, name: 'Ann' };
const set = new Set();

set.add(user);
user.name = 'Bob';

console.log(set.has(user));
console.log([...set]);
