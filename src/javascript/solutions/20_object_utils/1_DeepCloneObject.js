// Глубокое копирование объектов

const deepClone = (obj, map = new WeakMap()) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  if (map.has(obj)) {
    return map.get(obj);
  }

  const copy = Array.isArray(obj) ? [] : {};
  map.set(obj, copy);

  for (const key of Object.keys(obj)) {
    copy[key] = deepClone(obj[key], map);
  }

  return copy;
};

const original = {
  name: "Alice",
  age: 25,
  skills: ["JS", "React"],
  nested: {
    a: 1,
  },
};
original.self = original;

const copy = deepClone(original);

console.log(copy !== original); // true
console.log(copy.nested !== original.nested); // true
console.log(copy.skills !== original.skills); // true
console.log(copy.self === copy); // true
