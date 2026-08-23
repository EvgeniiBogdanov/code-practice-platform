const sumOfDigits = (num) => {
  let sum = 0;
  let n = Math.abs(num);

  while (n > 0) {
    sum += n % 10;
    n = Math.floor(n / 10);
  }

  return sum;
};

// Пример вызова:
console.log(sumOfDigits(1234)); // 10
console.log(sumOfDigits(5));    // 5
console.log(sumOfDigits(9081)); // 18
