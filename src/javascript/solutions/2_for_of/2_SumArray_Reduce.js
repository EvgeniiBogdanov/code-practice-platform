const sumNumbers = (arr) => {
  return arr.reduce((acc, curr) => acc + curr, 0);
};

// Пример вызова:
console.log(sumNumbers([43, 32, 33, 6, 8, 80])); // 202
console.log(sumNumbers([1, 2, 3, 4]));           // 10
