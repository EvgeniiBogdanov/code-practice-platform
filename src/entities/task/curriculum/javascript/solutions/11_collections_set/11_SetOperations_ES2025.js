// ES2025: у Set появились встроенные методы операций над множествами
const union = (a, b) => [...new Set(a).union(new Set(b))];

const intersection = (a, b) => [...new Set(a).intersection(new Set(b))];

const difference = (a, b) => [...new Set(a).difference(new Set(b))];

const symmetricDifference = (a, b) => [...new Set(a).symmetricDifference(new Set(b))];

// Пример вызова:
console.log(union([1, 2, 3], [2, 3, 4])); // [1, 2, 3, 4]
console.log(intersection([1, 2, 2, 3], [2, 3, 4])); // [2, 3]
console.log(difference([1, 2, 3], [2, 3, 4])); // [1]
console.log(symmetricDifference([1, 2, 3], [2, 3, 4])); // [1, 4]
console.log(intersection(["js", "ts"], ["go"])); // []
