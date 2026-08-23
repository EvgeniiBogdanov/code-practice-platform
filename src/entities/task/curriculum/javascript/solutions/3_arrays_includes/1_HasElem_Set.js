const fruits = ["banana", "apple", "cherry"];

const hasElemSet = (arr, el) => {
  const fruitSet = new Set(arr);
  return fruitSet.has(el);
};

// Пример вызова:
console.log(hasElemSet(fruits, "apple")); // true
