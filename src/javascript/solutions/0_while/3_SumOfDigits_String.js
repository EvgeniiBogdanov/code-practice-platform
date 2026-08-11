const sumOfDigits = (num) => {
  const str = String(Math.abs(num));
  let sum = 0;
  let i = 0;

  while (i < str.length) {
    sum += Number(str[i]);
    i++;
  }

  return sum;
};

// Пример вызова:
console.log(sumOfDigits(1234)); // 10
console.log(sumOfDigits(5));    // 5
console.log(sumOfDigits(9081)); // 18
