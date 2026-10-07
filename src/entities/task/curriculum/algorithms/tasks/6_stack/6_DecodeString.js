// Напишите функцию decodeString(s), которая раскодирует строку по правилу
// k[encoded_string]: подстрока encoded_string внутри квадратных скобок
// повторяется ровно k раз.
//
// Гарантии: входная строка корректна, скобки сбалансированы, k — положительное целое
// (может быть многозначным), цифры встречаются только как числа-множители.
// Скобки могут быть вложенными.
//
// Примеры:
// decodeString("3[a]2[bc]")      -> "aaabcbc"
// decodeString("3[a2[c]]")       -> "accaccacc"
// decodeString("2[abc]3[cd]ef")  -> "abcabccdcdcdef"
// decodeString("10[a]")          -> "aaaaaaaaaa"

const decodeString = (s) => {
  // Решение тут
};

// Пример вызова:
console.log(decodeString("3[a]2[bc]"));     // "aaabcbc"
console.log(decodeString("3[a2[c]]"));      // "accaccacc"
console.log(decodeString("2[abc]3[cd]ef")); // "abcabccdcdcdef"
console.log(decodeString("10[a]"));         // "aaaaaaaaaa"
