const searchInsert = (nums, target) => {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (nums[mid] === target) return mid;

    const isSmaller = nums[mid] < target;

    if (isSmaller) {
      left = mid + 1;
    }
    if (!isSmaller) {
      right = mid - 1;
    }
  }

  return left;
};

// Пример вызова:
console.log(searchInsert([1, 3, 5, 6], 5)); // 2
console.log(searchInsert([1, 3, 5, 6], 2)); // 1
console.log(searchInsert([1, 3, 5, 6], 7)); // 4
