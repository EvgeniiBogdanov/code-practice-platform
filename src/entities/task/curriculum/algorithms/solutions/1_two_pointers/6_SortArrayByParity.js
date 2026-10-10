const sortArrayByParity = (nums) => {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    while (left < right && nums[left] % 2 === 0) {
      left++;
    }

    while (left < right && nums[right] % 2 !== 0) {
      right--;
    }

    if (left < right) {
      [nums[left], nums[right]] = [nums[right], nums[left]];
      left++;
      right--;
    }
  }

  return nums;
};

// Пример вызова:
console.log(sortArrayByParity([5, 8, 1, 6])); // [6, 8, 1, 5]
console.log(sortArrayByParity([7, 2]));       // [2, 7]
console.log(sortArrayByParity([4, 10]));      // [4, 10]
console.log(sortArrayByParity([9, 3, 11]));   // [9, 3, 11]
console.log(sortArrayByParity([0]));          // [0]
