const map = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3],
]);

console.log(Array.from(map.keys())); // ['a', 'b', 'c']
console.log(Array.from(map.values())); // [1, 2, 3]
console.log(Array.from(map.entries())); // [['a', 1], ['b', 2], ['c', 3]]
