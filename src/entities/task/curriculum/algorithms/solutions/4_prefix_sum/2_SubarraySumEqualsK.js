const subarraySum = (nums, k) => {
  const map = new Map();
  map.set(0, 1);

  let count = 0;
  let currentSum = 0;

  for (const num of nums) {
    currentSum += num;

    if (map.has(currentSum - k)) {
      count += map.get(currentSum - k);
    }

    map.set(currentSum, (map.get(currentSum) || 0) + 1);
  }

  return count;
};

// Пример вызова:
console.log(subarraySum([1, 1, 1], 2));  // 2
console.log(subarraySum([1, 2, 3], 3));  // 2
console.log(subarraySum([1, -1, 0], 0)); // 3
