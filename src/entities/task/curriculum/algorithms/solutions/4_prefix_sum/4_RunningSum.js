const runningSum = (nums) => {
  const prefix = [];
  let sum = 0;

  for (const num of nums) {
    sum += num;
    prefix.push(sum);
  }

  return prefix;
};

// Пример вызова:
console.log(runningSum([1, 2, 3, 4])); // [1, 3, 6, 10]
console.log(runningSum([1, 1, 1, 1, 1])); // [1, 2, 3, 4, 5]
console.log(runningSum([])); // []
