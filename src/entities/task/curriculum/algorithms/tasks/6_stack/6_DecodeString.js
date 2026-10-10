// Напишите функцию decodeString(s), которая разворачивает сжатую запись:
// k[текст] означает, что текст в скобках повторяется k раз.
//
// Гарантии: запись корректна, скобки сбалансированы и могут быть вложенными,
// k — положительное целое (возможно, из нескольких цифр), других цифр в строке нет.

const decodeString = (s) => {
  // Решение тут
};

// Пример вызова:
console.log(decodeString("2[ab]3[c]")); // "ababccc"
console.log(decodeString("2[x3[y]]"));  // "xyyyxyyy"
console.log(decodeString("a2[bc]d"));   // "abcbcd"
console.log(decodeString("12[z]"));     // "zzzzzzzzzzzz"
