const deepClone = (value) => {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((item) => deepClone(item));
  const result = {};
  for (const key in value) {
    result[key] = deepClone(value[key]);
  }
  return result;
};

// Пример вызова:
const original = { a: 1, b: { c: [1, 2, { d: 3 }] } };
const cloned = deepClone(original);
cloned.b.c[2].d = 999;
console.log(original.b.c[2].d); // 3
console.log(cloned.b.c[2].d);   // 999
