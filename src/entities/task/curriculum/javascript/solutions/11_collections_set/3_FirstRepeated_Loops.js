const firstRepeated = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] === arr[i]) {
        return arr[i];
      }
    }
  }
  return null;
};

// Пример вызова:
console.log(firstRepeated([1, 2, 3, 2, 1])); // 2
console.log(firstRepeated([1, 2, 3]));       // null
