// Перемешивание массива: алгоритм Фишера — Йейтса
// Напишите функцию shuffle(arr), которая возвращает НОВЫЙ массив с элементами
// в случайном порядке. Все перестановки должны быть равновероятны.
// Не используйте arr.sort(() => Math.random() - 0.5) — такое распределение неравномерно.

const shuffle = (arr) => {
  // Решение тут
};

// Пример вызова:
const source = [1, 2, 3, 4, 5];
const result = shuffle(source);
console.log(result.length); // 5
console.log([...result].sort((a, b) => a - b)); // [1, 2, 3, 4, 5] — те же элементы
console.log(source); // [1, 2, 3, 4, 5] — исходный массив не изменился

// Проверка равномерности: у [1, 2, 3] шесть перестановок, каждая должна выпадать ~16.7% раз
const counts = {};
for (let i = 0; i < 60000; i++) {
  const key = shuffle([1, 2, 3]).join("");
  counts[key] = (counts[key] ?? 0) + 1;
}
console.log(Object.keys(counts).length); // 6
console.log(Object.values(counts).every((n) => n > 9000 && n < 11000)); // true
