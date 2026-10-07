const findDisappearedNumbers = (nums) => {
  // Число x помечает «увиденность» ячейки с индексом x - 1 через знак значения
  for (const num of nums) {
    const index = Math.abs(num) - 1;
    if (nums[index] > 0) {
      nums[index] = -nums[index];
    }
  }

  // Положительное значение в ячейке i значит, что число i + 1 не встречалось
  const missing = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) {
      missing.push(i + 1);
    }
  }
  return missing;
};

// Пример вызова:
console.log(findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1])); // [5, 6]
console.log(findDisappearedNumbers([1, 1]));                   // [2]
console.log(findDisappearedNumbers([1, 2, 3]));                // []
