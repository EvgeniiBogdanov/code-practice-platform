const reverseNumber = (num) => {
  let reversed = 0;
  let n = num;

  while (n > 0) {
    const lastDigit = n % 10;
    reversed = reversed * 10 + lastDigit;
    n = Math.floor(n / 10);
  }

  return reversed;
};

// Пример вызова:
console.log(reverseNumber(12345)); // 54321
console.log(reverseNumber(980));   // 89
console.log(reverseNumber(7));     // 7
