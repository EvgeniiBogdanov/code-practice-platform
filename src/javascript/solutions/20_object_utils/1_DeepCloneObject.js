const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item));

  const result = {};
  for (const key of Object.keys(obj)) {
    result[key] = deepClone(obj[key]);
  }
  return result;
};

// Пример вызова:
const orig = { a: 1, b: { c: [2, 3] } };
const copy = deepClone(orig);
copy.b.c.push(4);
console.log(orig.b.c.length); // 2
console.log(copy.b.c.length); // 3
