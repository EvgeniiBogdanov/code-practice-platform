// Вариант 2: Через метод reduce()
const arr = [5, 10, 2];

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0);

console.log(sum(arr)); // 17
