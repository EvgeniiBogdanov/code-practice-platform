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
console.log(runningSum([5, -2, 4])); // [5, 3, 7]
console.log(runningSum([0, 0, 1]));  // [0, 0, 1]
console.log(runningSum([]));         // []
