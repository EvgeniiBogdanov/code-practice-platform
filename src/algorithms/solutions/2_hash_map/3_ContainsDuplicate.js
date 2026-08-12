const containsDuplicate = (nums) => {
  const set = new Set();
  for (const num of nums) {
    if (set.has(num)) {
      return true;
    }
    set.add(num);
  }
  return false;
};

// Пример вызова:
console.log(containsDuplicate([1, 2, 3, 1]));                   // true
console.log(containsDuplicate([1, 2, 3, 4]));                   // false
console.log(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])); // true
