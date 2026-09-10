const firstRepeated = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] === arr[i]) {
        return arr[i];
      }
    }
  }
  return undefined;
};

// Пример вызова:
console.log(firstRepeated([2, 5, 1, 2, 3, 5, 1])); // 2
console.log(firstRepeated([2, 1, 3, 5, 3, 2]));    // 3
console.log(firstRepeated([1, 2, 3, 4]));          // undefined
