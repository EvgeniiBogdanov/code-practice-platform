const arr = ["a", "b", "a", "c", "b", "a"];

const countFrequency = (arr) => {
  const map = new Map();
  for (const item of arr) {
    map.set(item, (map.get(item) || 0) + 1);
  }
  return map;
};

console.log(countFrequency(arr));
