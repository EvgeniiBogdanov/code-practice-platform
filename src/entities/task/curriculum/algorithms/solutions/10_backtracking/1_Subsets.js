const subsets = (nums) => {
  const result = [];
  const path = [];

  const backtrack = (start) => {
    result.push([...path]);

    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  };

  backtrack(0);
  return result;
};

// Пример вызова:
console.log(subsets([4, 7]));    // [[], [4], [4, 7], [7]]
console.log(subsets([1, 5, 9])); // [[], [1], [1, 5], [1, 5, 9], [1, 9], [5], [5, 9], [9]]
console.log(subsets([]));        // [[]]
