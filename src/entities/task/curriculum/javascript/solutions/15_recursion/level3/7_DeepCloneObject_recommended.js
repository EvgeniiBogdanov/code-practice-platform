const deepClone = (value) => structuredClone(value);

// Пример вызова:
const original = { a: 1, b: { c: [1, 2, { d: 3 }] } };
const cloned = deepClone(original);
cloned.b.c[2].d = 999;
console.log(original.b.c[2].d); // 3
console.log(cloned.b.c[2].d);   // 999
