const arr = ["a", "b", "a", "c", "b", "a"];

const countFrequency = (arr) => {
  const map = new Map();
  for (const item of arr) {
    map.set(item, (map.get(item) || 0) + 1);
  }
  return map;
};

// Пример вызова:
console.log(countFrequency(arr)); // Map(3) { "a" => 3, "b" => 2, "c" => 1 }
