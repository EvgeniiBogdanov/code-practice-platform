const minSubArrayLen = (target, nums) => {
  let left = 0;
  let sum = 0;
  let minLength = Infinity;

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];

    while (sum >= target) {
      minLength = Math.min(minLength, right - left + 1);
      sum -= nums[left];
      left++;
    }
  }

  return minLength === Infinity ? 0 : minLength;
};

// Пример вызова:
console.log(minSubArrayLen(9, [1, 4, 2, 5, 3, 1])); // 3
console.log(minSubArrayLen(6, [6, 1, 1]));          // 1
console.log(minSubArrayLen(15, [2, 3, 4]));         // 0
