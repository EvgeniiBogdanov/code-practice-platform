// Вариант 1: Через цикл for
const arrayNumbers = [5, 10, 2];

const sumNumbers = (arr) => {
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }

  return sum;
};

const result = sumNumbers(arrayNumbers);
console.log(result);
