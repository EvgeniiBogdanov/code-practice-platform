// Обход элементов Map
// Напишите функцию mapForEach(map, callback), которая вызывает callback(value, key) для каждой записи в Map.

const mapForEach = (map, callback) => {
  // Решение тут
};

// Пример вызова:
const scores = new Map([["Alice", 90], ["Bob", 80]]);
mapForEach(scores, (val, key) => console.log(`${key}: ${val}`));
// Alice: 90
// Bob: 80
