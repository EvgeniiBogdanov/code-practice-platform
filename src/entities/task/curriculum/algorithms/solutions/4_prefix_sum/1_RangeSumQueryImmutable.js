const createNumArray = (nums) => {
  const prefix = new Array(nums.length + 1).fill(0);
  
  for (let i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  return {
    sumRange: (left, right) => prefix[right + 1] - prefix[left],
  };
};

// Пример вызова:
const balance = createNumArray([4, -1, 3, 0, 5, -2]);
console.log(balance.sumRange(1, 3)); // 2
console.log(balance.sumRange(0, 5)); // 9
console.log(balance.sumRange(4, 4)); // 5
