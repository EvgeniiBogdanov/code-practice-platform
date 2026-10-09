const search = (nums, target) => {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (nums[mid] === target) return mid;

    const leftHalfSorted = nums[left] <= nums[mid];

    if (leftHalfSorted) {
      const targetInLeftHalf = nums[left] <= target && target < nums[mid];
      targetInLeftHalf ? (right = mid - 1) : (left = mid + 1);
    }

    if (!leftHalfSorted) {
      const targetInRightHalf = nums[mid] < target && target <= nums[right];
      targetInRightHalf ? (left = mid + 1) : (right = mid - 1);
    }
  }

  return -1;
};

// Пример вызова:
console.log(search([30, 40, 50, 10, 20], 10)); // 3
console.log(search([30, 40, 50, 10, 20], 35)); // -1
console.log(search([6, 7, 1, 2, 3, 4, 5], 7)); // 1
console.log(search([2], 2));                   // 0
