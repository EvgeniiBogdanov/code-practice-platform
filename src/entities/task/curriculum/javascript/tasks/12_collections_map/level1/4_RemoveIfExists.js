// Напишите функцию removeIfExists(map, key), которая удаляет ключ,
// если он существует, и возвращает true/false — был ли ключ удалён.

const map = new Map([["a", 1], ["b", 2]]);

const removeIfExists = (map, key) => {
  // Ваш код здесь
};

console.log(removeIfExists(map, "a")); // true
console.log(removeIfExists(map, "z")); // false
