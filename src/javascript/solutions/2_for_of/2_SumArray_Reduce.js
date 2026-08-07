// Вариант 2: Через метод reduce()
const arr = [43, 32, 33, 6, 8, 80];

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0);

console.log(sum(arr)); // 202
