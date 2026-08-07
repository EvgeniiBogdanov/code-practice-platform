// Вариант 1: Через цикл for...of
const arrayNumbers = [43, 32, 33, 6, 8, 80];

const sumNumbers = (arr) => {
  let sum = 0;

  for (const num of arr) {
    sum += num;
  }

  return sum;
};

const result = sumNumbers(arrayNumbers);
console.log(result);
