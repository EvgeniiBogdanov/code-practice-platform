const findMinMax = (numbers) => {
  return numbers.reduce((acc, num) => {
    acc.min = acc.min < num ? acc.min : num;
    acc.max = acc.max > num ? acc.max : num;
    return acc;
  }, { min: Infinity, max: -Infinity });
};

// Пример вызова:
console.log(findMinMax([23, 4, 45, 2, 8, 16])); // { min: 2, max: 45 }
