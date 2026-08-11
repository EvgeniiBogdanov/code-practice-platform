const merge = (arr1, arr2) => {
  return [...arr1, ...arr2].sort((a, b) => a - b);
};

// Пример вызова:
console.log(merge([1, 3, 5], [2, 4, 6])); // [1, 2, 3, 4, 5, 6]
console.log(merge([1, 2], [3, 4, 5, 6])); // [1, 2, 3, 4, 5, 6]
console.log(merge([], [1, 2]));           // [1, 2]
