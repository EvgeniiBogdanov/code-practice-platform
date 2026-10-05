// Сжатие строки (Run-Length Encoding)
// Напишите функцию compress(str): подряд идущие одинаковые символы заменяются
// символом и количеством повторов. Если символ встречается один раз подряд, число не пишется.

const compress = (str) => {
  // Решение тут
};

// Пример вызова:
console.log(compress("aaabbc")); // "a3b2c"
console.log(compress("abc")); // "abc"
console.log(compress("aaaaaaaaaaaa")); // "a12"
console.log(compress("aabbaa")); // "a2b2a2"
console.log(compress("")); // ""
