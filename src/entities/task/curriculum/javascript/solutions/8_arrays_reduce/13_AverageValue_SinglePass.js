const average = (numbers) => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((acc, num, _, arr) => acc + num / arr.length, 0);
};

// Пример вызова:
console.log(average([10, 20, 30, 40])); // 25
console.log(average([5, 15]));          // 10
