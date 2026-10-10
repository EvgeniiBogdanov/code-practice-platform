const combinationSum = (candidates, target) => {
  const result = [];
  const current = [];

  const backtrack = (start, remaining) => {
    if (remaining === 0) {
      result.push([...current]);
      return;
    }

    if (remaining < 0) {
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);
      backtrack(i, remaining - candidates[i]);
      current.pop();
    }
  };

  backtrack(0, target);
  return result;
};

// Пример вызова:
console.log(combinationSum([3, 4, 5], 8)); // [[3, 5], [4, 4]]
console.log(combinationSum([2, 5], 9));    // [[2, 2, 5]]
console.log(combinationSum([4, 6], 5));    // []
