const sumNumbers = (arr) => {
  let sum = 0;

  for (const num of arr) {
    sum += num;
  }

  return sum;
};

// Пример вызова:
console.log(sumNumbers([43, 32, 33, 6, 8, 80])); // 202
console.log(sumNumbers([1, 2, 3, 4]));           // 10
