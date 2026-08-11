// Результат find при отсутствии элемента
// Что вернёт метод find, если подходящий элемент не найден?

const numbers = [1, 3, 5, 7];
const result = numbers.find((num) => num % 2 === 0);
console.log(result);
