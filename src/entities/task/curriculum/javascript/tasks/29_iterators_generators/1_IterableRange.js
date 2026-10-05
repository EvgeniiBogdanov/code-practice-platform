// Итерируемый объект: Symbol.iterator
// Напишите функцию createRange(from, to, step = 1), возвращающую итерируемый объект:
// - его можно перебрать через for...of, spread и Array.from;
// - перебор можно запускать повторно (каждый раз с начала);
// - объект НЕ должен заранее хранить все числа в массиве.

const createRange = (from, to, step = 1) => {
  // Решение тут
};

// Пример вызова:
const range = createRange(1, 5);
for (const n of range) {
  console.log(n); // 1, 2, 3, 4, 5
}
console.log([...range]); // [1, 2, 3, 4, 5] — повторный перебор работает
console.log(Array.from(createRange(0, 10, 3))); // [0, 3, 6, 9]
console.log([...createRange(5, 1)]); // []

const [first, second] = createRange(10, 20);
console.log(first, second); // 10 11
