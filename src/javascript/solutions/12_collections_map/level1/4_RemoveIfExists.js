const map = new Map([["a", 1], ["b", 2]]);

const removeIfExists = (map, key) => {
  if (map.has(key)) {
    map.delete(key);
    return true;
  }
  return false;
};

console.log(removeIfExists(map, "a")); // true
console.log(removeIfExists(map, "z")); // false
