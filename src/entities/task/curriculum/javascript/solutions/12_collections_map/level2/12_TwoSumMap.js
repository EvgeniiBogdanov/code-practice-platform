const twoSum = (nums, target) => {
  // Map: значение -> индекс уже просмотренных элементов
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    // Проверяем ДО записи текущего числа, чтобы не использовать один элемент дважды
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }

    seen.set(nums[i], i);
  }

  return [];
};

// Пример вызова:
console.log(twoSum([5, 12, 3, 8], 11)); // [2, 3]
console.log(twoSum([4, -1, 7, 10], 3)); // [0, 1]
console.log(twoSum([6, 6, 1], 12));     // [0, 1]
console.log(twoSum([1, 2, 3], 100));    // []
