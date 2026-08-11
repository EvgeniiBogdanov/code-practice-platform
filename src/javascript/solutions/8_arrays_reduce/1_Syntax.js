const numbers = [1, 2, 3];

const result = numbers.reduce((acc, curr) => {
  return acc + curr;
}, 0);

// Пример вызова:
console.log(result); // 6
