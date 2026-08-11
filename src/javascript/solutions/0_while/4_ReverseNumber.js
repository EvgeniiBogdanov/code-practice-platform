const reverseNumber = (num) => {
  let reversed = 0;
  let n = Math.abs(num);

  while (n > 0) {
    reversed = reversed * 10 + (n % 10);
    n = Math.floor(n / 10);
  }

  return num < 0 ? -reversed : reversed;
};
