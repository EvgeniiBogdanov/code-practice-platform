const sumAndProduct = (numbers) => {
  return numbers.reduce((acc, num) => {
    acc.sum += num;
    acc.prod *= num;
    return acc;
  }, { sum: 0, prod: 1 });
};

// Пример вызова:
console.log(sumAndProduct([1, 2, 3, 4, 5])); // { sum: 15, prod: 120 }
