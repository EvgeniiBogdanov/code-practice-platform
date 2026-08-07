// Вариант 2: Через метод массива includes()
const fruits = ["яблоко", "банан", "апельсин", "груша"];

const hasElement = (arr, element) => arr.includes(element);

console.log(hasElement(fruits, "банан")); // true
