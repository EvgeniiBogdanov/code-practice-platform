// Set.has работает за O(1), поэтому filter по Set — O(n), а не O(n * m)
const union = (a, b) => [...new Set([...a, ...b])];

const intersection = (a, b) => {
  const setB = new Set(b);
  return [...new Set(a)].filter((item) => setB.has(item));
};

const difference = (a, b) => {
  const setB = new Set(b);
  return [...new Set(a)].filter((item) => !setB.has(item));
};

const symmetricDifference = (a, b) => [...difference(a, b), ...difference(b, a)];

// Пример вызова:
console.log(union([1, 2, 3], [2, 3, 4])); // [1, 2, 3, 4]
console.log(intersection([1, 2, 2, 3], [2, 3, 4])); // [2, 3]
console.log(difference([1, 2, 3], [2, 3, 4])); // [1]
console.log(symmetricDifference([1, 2, 3], [2, 3, 4])); // [1, 4]
console.log(intersection(["js", "ts"], ["go"])); // []
