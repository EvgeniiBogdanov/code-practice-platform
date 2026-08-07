const numbers = [23, 4, 45, 2, 8, 16];

const findMinMax = (arr) => {
  return arr.reduce((acc, num) => {
    acc.min = Math.min(acc.min, num);
    acc.max = Math.max(acc.max, num);

    return acc;
  }, { min: Infinity, max: -Infinity });
};

console.log(findMinMax(numbers)); // { min: 2, max: 45 }
