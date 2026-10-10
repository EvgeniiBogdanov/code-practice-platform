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
console.log(containsDuplicate([7, 3, 9, 3])); // true
console.log(containsDuplicate([10, 20, 30])); // false
console.log(containsDuplicate([5, 5]));       // true
console.log(containsDuplicate([]));           // false
