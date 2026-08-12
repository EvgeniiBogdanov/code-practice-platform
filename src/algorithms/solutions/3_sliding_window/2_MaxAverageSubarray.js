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
console.log(findMaxAverage([1, 12, -5, -6, 50, 3], 4)); // 12.75
console.log(findMaxAverage([5], 1));                   // 5
