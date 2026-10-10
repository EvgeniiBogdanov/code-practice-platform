const removeDuplicates = (nums) => {
  if (nums.length === 0) {
    return 0;
  }

  let slow = 0;

  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }

  return slow + 1;
};

// Пример вызова:
console.log(removeDuplicates([2, 2, 2, 5, 7, 7])); // 3
console.log(removeDuplicates([-1, 0, 0, 4]));      // 3
console.log(removeDuplicates([8]));                // 1
console.log(removeDuplicates([]));                 // 0
