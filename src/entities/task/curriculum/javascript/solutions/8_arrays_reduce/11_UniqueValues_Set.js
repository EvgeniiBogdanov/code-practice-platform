// Set хранит только уникальные значения и сохраняет порядок вставки
const unique = (arr) => [...new Set(arr)];

// Пример вызова:
console.log(unique([1, 2, 2, 3, 4, 4, 5, 1])); // [1, 2, 3, 4, 5]
console.log(unique(["a", "b", "a", "a", "c"])); // ["a", "b", "c"]
console.log(unique([NaN, NaN, 0, -0])); // [NaN, 0] — Set использует SameValueZero
console.log(unique([])); // []
