const sumNumbers = (arr) => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
};

// Пример вызова:
console.log(sumNumbers([5, 10, 2]));   // 17
console.log(sumNumbers([1, 2, 3, 4])); // 10
