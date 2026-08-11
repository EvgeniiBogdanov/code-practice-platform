const sumNumbers = (arr) => {
  return arr.reduce((acc, curr) => acc + curr, 0);
};

// Пример вызова:
console.log(sumNumbers([5, 10, 2]));   // 17
console.log(sumNumbers([1, 2, 3, 4])); // 10
