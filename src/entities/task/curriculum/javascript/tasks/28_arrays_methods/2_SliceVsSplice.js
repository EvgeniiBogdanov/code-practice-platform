// Что выведет данный код в консоль и почему?
// Обратите внимание, какие методы изменяют исходный массив.

const letters = ["a", "b", "c", "d", "e"];

const part = letters.slice(1, 3);
console.log(part);
console.log(letters);

const removed = letters.splice(1, 2);
console.log(removed);
console.log(letters);

letters.splice(1, 0, "X", "Y");
console.log(letters);

console.log(letters.slice(-2));

const numbers = [3, 1, 2];
const sorted = numbers.sort();
console.log(sorted === numbers);
console.log(numbers);

const reversed = [...numbers].reverse();
console.log(numbers);
console.log(reversed);
