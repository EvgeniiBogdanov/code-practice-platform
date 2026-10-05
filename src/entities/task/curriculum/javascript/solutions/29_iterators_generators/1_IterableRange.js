const createRange = (from, to, step = 1) => ({
  // for...of, spread и деструктуризация вызывают obj[Symbol.iterator]()
  [Symbol.iterator]() {
    // Состояние перебора живёт в замыкании: каждый вызов — новый независимый итератор
    let current = from;

    return {
      next() {
        if (current > to) {
          return { value: undefined, done: true };
        }
        const value = current;
        current += step;
        return { value, done: false };
      },
    };
  },
});

// Пример вызова:
const range = createRange(1, 5);
for (const n of range) {
  console.log(n); // 1, 2, 3, 4, 5
}
console.log([...range]); // [1, 2, 3, 4, 5]
console.log(Array.from(createRange(0, 10, 3))); // [0, 3, 6, 9]
console.log([...createRange(5, 1)]); // []

const [first, second] = createRange(10, 20);
console.log(first, second); // 10 11
