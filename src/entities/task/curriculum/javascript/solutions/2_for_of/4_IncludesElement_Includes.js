const includesElement = (arr, target) => {
  return arr.includes(target);
};

// Пример вызова:
console.log(includesElement(["яблоко", "банан", "апельсин", "груша"], "банан")); // true
console.log(includesElement(["яблоко", "банан", "апельсин", "груша"], "киви"));  // false
