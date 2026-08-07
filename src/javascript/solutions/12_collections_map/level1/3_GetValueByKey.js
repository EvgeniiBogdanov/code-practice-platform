const map = new Map([["x", 10], ["y", 20]]);

const getValue = (map, key) => {
  return map.has(key) ? map.get(key) : "not found";
};

console.log(getValue(map, "x")); // 10
console.log(getValue(map, "z")); // "not found"
