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
const numArray = createNumArray([-2, 0, 3, -5, 2, -1]);
console.log(numArray.sumRange(0, 2)); // 1
console.log(numArray.sumRange(2, 5)); // -1
console.log(numArray.sumRange(0, 5)); // -3
