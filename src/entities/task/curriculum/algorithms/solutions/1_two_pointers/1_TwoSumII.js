const twoSum = (numbers, target) => {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) {
      return [left + 1, right + 1];
    }

    if (sum < target) {
      left++;
    }

    if (sum > target) {
      right--;
    }
  }

  return [];
};

// Пример вызова:
console.log(twoSum([1, 3, 4, 6, 9], 13));  // [3, 5]
console.log(twoSum([-5, -2, 0, 3, 8], 1)); // [2, 4]
console.log(twoSum([2, 2, 5], 4));         // [1, 2]
