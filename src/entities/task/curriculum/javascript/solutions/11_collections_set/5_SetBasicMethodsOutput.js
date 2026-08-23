const set = new Set();

set.add(1);
set.add(2);
set.add(2);
set.add(3);

console.log(set.size);   // 3
console.log(set.has(2));  // true
set.delete(2);
console.log(set.has(2));  // false
set.clear();
console.log(set.size);   // 0
