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
console.log(permute([7, 8]));    // [[7, 8], [8, 7]]
console.log(permute([4, 5, 6])); // [[4, 5, 6], [4, 6, 5], [5, 4, 6], [5, 6, 4], [6, 4, 5], [6, 5, 4]]
console.log(permute([9]));       // [[9]]
