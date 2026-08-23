const hasElem = (arr, target) => {
  return arr.includes(target);
};

// Пример вызова:
console.log(hasElem(["banana", "apple", "cherry"], "apple")); // true
console.log(hasElem(["banana", "apple", "cherry"], "mango")); // false
