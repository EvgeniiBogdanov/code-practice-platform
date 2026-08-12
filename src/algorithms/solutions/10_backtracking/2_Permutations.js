const permute = (nums) => {
  const result = [];
  const path = [];
  const used = [...nums].fill(false);

  const backtrack = () => {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i] === false) {
        used[i] = true;
        path.push(nums[i]);

        backtrack();

        path.pop();
        used[i] = false;
      }
    }
  };

  backtrack();
  return result;
};

// Пример вызова:
console.log(permute([1, 2, 3])); // [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
console.log(permute([0, 1]));    // [[0, 1], [1, 0]]
console.log(permute([1]));       // [[1]]
