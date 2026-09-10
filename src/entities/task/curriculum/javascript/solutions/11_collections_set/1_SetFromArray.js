const getUnique = (arr) => {
  return [...new Set(arr)];
};

// Пример вызова:
console.log(getUnique([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]
console.log(getUnique(["a", "b", "a", "c"]));   // ["a", "b", "c"]
