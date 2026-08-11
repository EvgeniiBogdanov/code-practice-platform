const sumOfDigits = (num) => {
  return String(Math.abs(num))
    .split("")
    .reduce((acc, digit) => acc + Number(digit), 0);
};
