// Безопасное получение значения из Map
// Напишите функцию getValue(map, key, defaultValue), которая возвращает значение по ключу, а если ключа нет — defaultValue.

const getValue = (map, key, defaultValue) => {
  // Решение тут
};

// Пример вызова:
const map = new Map([["name", "Alice"]]);
console.log(getValue(map, "name", "Anonymous")); // "Alice"
console.log(getValue(map, "age", 18));           // 18
