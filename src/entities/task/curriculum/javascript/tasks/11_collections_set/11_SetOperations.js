// Операции над множествами: объединение, пересечение, разность
// Реализуйте функции, которые принимают два массива и возвращают массив без дубликатов:
// 1. union(a, b) — элементы, которые есть хотя бы в одном массиве
// 2. intersection(a, b) — элементы, которые есть в обоих массивах
// 3. difference(a, b) — элементы из a, которых нет в b
// 4. symmetricDifference(a, b) — элементы, которые есть ровно в одном из массивов
// Каждая функция должна работать за O(n + m).

const union = (a, b) => {
  // Решение тут
};

const intersection = (a, b) => {
  // Решение тут
};

const difference = (a, b) => {
  // Решение тут
};

const symmetricDifference = (a, b) => {
  // Решение тут
};

// Пример вызова:
console.log(union([1, 2, 3], [2, 3, 4])); // [1, 2, 3, 4]
console.log(intersection([1, 2, 2, 3], [2, 3, 4])); // [2, 3]
console.log(difference([1, 2, 3], [2, 3, 4])); // [1]
console.log(symmetricDifference([1, 2, 3], [2, 3, 4])); // [1, 4]
console.log(intersection(["js", "ts"], ["go"])); // []
