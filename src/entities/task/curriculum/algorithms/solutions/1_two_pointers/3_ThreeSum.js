const threeSum = (nums) => {
  const result = [];
  const sorted = [...nums].sort((a, b) => a - b);

  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) {
      continue;
    }

    let left = i + 1;
    let right = sorted.length - 1;

    while (left < right) {
      const sum = sorted[i] + sorted[left] + sorted[right];

      if (sum === 0) {
        result.push([sorted[i], sorted[left], sorted[right]]);

        while (left < right && sorted[left] === sorted[left + 1]) {
          left++;
        }
        while (left < right && sorted[right] === sorted[right - 1]) {
          right--;
        }

        left++;
        right--;
        continue;
      }

      if (sum < 0) {
        left++;
        continue;
      }

      if (sum > 0) {
        right--;
      }
    }
  }

  return result;
};

// Пример вызова:
console.log(threeSum([-2, 0, 1, 1, 2])); // [[-2, 0, 2], [-2, 1, 1]]
console.log(threeSum([1, 2, -4, 3]));    // [[-4, 1, 3]]
console.log(threeSum([5, 6, 7]));        // []
console.log(threeSum([0, 0, 0, 0]));     // [[0, 0, 0]]
