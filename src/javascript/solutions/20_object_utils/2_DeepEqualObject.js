// Глубокое сравнение объектов

const deepEqual = (a, b) => {
  if (a === b) return true;

  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
};

const obj1 = { a: 1, b: { c: 2 }, d: [1, 2] };
const obj2 = { a: 1, b: { c: 2 }, d: [1, 2] };
const obj3 = { a: 1, b: { c: 3 }, d: [1, 2] };

console.log(deepEqual(obj1, obj2)); // true
console.log(deepEqual(obj1, obj3)); // false
console.log(deepEqual(5, 5)); // true
console.log(deepEqual(null, undefined)); // false
