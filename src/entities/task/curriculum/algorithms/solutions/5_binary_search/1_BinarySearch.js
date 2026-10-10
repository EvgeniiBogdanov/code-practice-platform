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
console.log(search([-7, -2, 0, 4, 11, 19], 11)); // 4
console.log(search([-7, -2, 0, 4, 11, 19], 5));  // -1
console.log(search([8], 8));                     // 0
