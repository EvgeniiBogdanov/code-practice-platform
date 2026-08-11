const sumOfDigits = (num) => {
  let sum = 0;
  let n = Math.abs(num);

  while (n > 0) {
    sum += n % 10;
    n = Math.floor(n / 10);
  }

  return sum;
};
