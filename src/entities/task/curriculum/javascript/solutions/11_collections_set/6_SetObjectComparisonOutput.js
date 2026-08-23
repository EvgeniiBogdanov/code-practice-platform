const a = { x: 1 };
const b = { x: 1 };

const set = new Set();
set.add(a);
set.add(b);

console.log(set.size);           // 2
console.log(set.has(a));          // true
console.log(set.has({ x: 1 }));   // false
