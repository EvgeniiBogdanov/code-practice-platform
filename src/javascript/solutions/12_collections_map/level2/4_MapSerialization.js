const mapToObject = (map) => {
  return Object.fromEntries(map);
};

const objectToMap = (obj) => {
  return new Map(Object.entries(obj));
};

// Пример вызова:
const m = new Map([["a", 1], ["b", 2]]);
console.log(mapToObject(m)); // { a: 1, b: 2 }
console.log(objectToMap({ x: 10, y: 20 }).get("x")); // 10
