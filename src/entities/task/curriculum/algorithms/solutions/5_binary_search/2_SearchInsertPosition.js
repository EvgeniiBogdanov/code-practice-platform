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
console.log(searchInsert([10, 20, 30, 40], 30)); // 2
console.log(searchInsert([10, 20, 30, 40], 25)); // 2
console.log(searchInsert([10, 20, 30, 40], 5));  // 0
console.log(searchInsert([10, 20, 30, 40], 50)); // 4
