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
console.log(moveZeroes([4, 0, 5, 0, 0, 7])); // [4, 5, 7, 0, 0, 0]
console.log(moveZeroes([0, 0, 9]));          // [9, 0, 0]
console.log(moveZeroes([2, 8]));             // [2, 8]
console.log(moveZeroes([0]));                // [0]
