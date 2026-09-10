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
console.log(sortArrayByParity([3, 1, 2, 4])); // [4, 2, 1, 3]
console.log(sortArrayByParity([0])); // [0]
console.log(sortArrayByParity([1, 2])); // [2, 1]
console.log(sortArrayByParity([2, 4, 6])); // [2, 4, 6]
console.log(sortArrayByParity([1, 3, 5])); // [1, 3, 5]
