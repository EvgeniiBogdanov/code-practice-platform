const sortAscending = (numbers) => {
  return [...numbers].sort((a, b) => a - b);
};

// Пример вызова:
console.log(sortAscending([40, 100, 1, 5, 25, 10])); // [1, 5, 10, 25, 40, 100]
