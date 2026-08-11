const sum = (arr) => {
  return arr.reduce((acc, num) => acc + num, 0);
};

// Пример вызова:
console.log(sum([1, 2, 3, 4, 5])); // 15
console.log(sum([10, -5, 3]));     // 8
console.log(sum([]));              // 0
