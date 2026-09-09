const moveZeroes = (nums) => {
  let slow = 0;

  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      if (slow !== fast) {
        [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
      }
      slow++;
    }
  }

  return nums;
};

// Пример вызова:
console.log(moveZeroes([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]
console.log(moveZeroes([0])); // [0]
console.log(moveZeroes([1, 2, 3])); // [1, 2, 3]
console.log(moveZeroes([0, 0, 1])); // [1, 0, 0]
