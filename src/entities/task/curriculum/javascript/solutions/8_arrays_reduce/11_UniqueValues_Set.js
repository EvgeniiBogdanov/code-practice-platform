const unique = (arr) => {
  return [...new Set(arr)];
};

// Пример вызова:
console.log(unique([1, 2, 1, 3, 2, 4]));
console.log(unique(["a", "b", "a", "a", "c"]));
