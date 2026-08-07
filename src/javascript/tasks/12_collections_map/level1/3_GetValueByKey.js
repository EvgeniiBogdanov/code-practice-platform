// Напишите функцию getValue(map, key), которая возвращает значение по ключу,
// а если ключа нет — возвращает строку "not found"

const map = new Map([["x", 10], ["y", 20]]);

const getValue = (map, key) => {
  // Ваш код здесь
};

console.log(getValue(map, "x")); // 10
console.log(getValue(map, "z")); // "not found"
