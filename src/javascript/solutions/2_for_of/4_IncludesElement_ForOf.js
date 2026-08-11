const includesElement = (arr, target) => {
  for (const item of arr) {
    if (item === target) {
      return true;
    }
  }
  return false;
};

// Пример вызова:
console.log(includesElement(["яблоко", "банан", "апельсин", "груша"], "банан")); // true
console.log(includesElement(["яблоко", "банан", "апельсин", "груша"], "киви"));  // false
