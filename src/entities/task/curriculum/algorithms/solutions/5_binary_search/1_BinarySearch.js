const search = (nums, target) => {
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

  return -1;
};

// Пример вызова:
console.log(search([-1, 0, 3, 5, 9, 12], 9)); // 4
console.log(search([-1, 0, 3, 5, 9, 12], 2)); // -1
console.log(search([5], 5));                   // 0
