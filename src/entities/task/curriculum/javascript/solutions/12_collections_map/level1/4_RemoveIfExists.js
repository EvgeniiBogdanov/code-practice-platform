const map = new Map([["a", 1], ["b", 2]]);

const removeIfExists = (map, key) => {
  return map.delete(key);
};

// Пример вызова:
console.log(removeIfExists(map, "a")); // true
console.log(removeIfExists(map, "z")); // false
