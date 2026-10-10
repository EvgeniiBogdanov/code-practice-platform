const findMaxAverage = (nums, k) => {
  let windowSum = 0;

  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }

  let maxSum = windowSum;

  for (let right = k; right < nums.length; right++) {
    windowSum += nums[right] - nums[right - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum / k;
};

// Пример вызова:
console.log(findMaxAverage([2, 9, -4, 7, 5, 1], 2)); // 6
console.log(findMaxAverage([-3, -1, -7], 1));        // -1
console.log(findMaxAverage([6, 2, 4, 8], 4));        // 5
