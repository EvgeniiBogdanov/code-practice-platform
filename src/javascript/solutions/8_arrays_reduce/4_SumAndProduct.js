const numbers = [1, 2, 3, 4, 5];

const sum = (arr) => {
  return arr.reduce((acc, num) => {
    acc.sum += num;
    acc.prod *= num;

    return acc;
  }, { sum: 0, prod: 1 });
};

console.log(sum(numbers)); // { sum: 15, prod: 120 }
