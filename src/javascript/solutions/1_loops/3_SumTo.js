const sumTo = (n) => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// Пример вызова:
console.log(sumTo(4)); // 10
console.log(sumTo(3)); // 6
