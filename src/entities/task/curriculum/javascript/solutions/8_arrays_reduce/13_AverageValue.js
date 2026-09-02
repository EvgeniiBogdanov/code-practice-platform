const average = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

// Вариант 2 (однопроходный внутри reduce):
// const average = (numbers) => {
//   if (numbers.length === 0) return 0;
//   return numbers.reduce((acc, num, _, arr) => acc + num / arr.length, 0);
// };

// Пример вызова:
console.log(average([1, 2, 3, 4, 5])); // 3
console.log(average([10, 20, 30]));    // 20
