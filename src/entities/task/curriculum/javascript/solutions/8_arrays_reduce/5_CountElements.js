const countOccurrences = (arr) => {
  return arr.reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});
};

// Пример вызова:
console.log(countOccurrences(["a", "b", "a", "c", "b", "a"])); // { a: 3, b: 2, c: 1 }
console.log(countOccurrences([1, 2, 1, 1]));                   // { 1: 3, 2: 1 }
