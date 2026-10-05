// Анаграммы после сортировки символов дают одинаковые строки
const sortChars = (str) => [...str.toLowerCase().replace(/\s/g, "")].sort().join("");

const isAnagram = (a, b) => sortChars(a) === sortChars(b);

// Пример вызова:
console.log(isAnagram("listen", "silent")); // true
console.log(isAnagram("Апельсин", "спаниель")); // true
console.log(isAnagram("Dormitory", "dirty room")); // true
console.log(isAnagram("hello", "world")); // false
console.log(isAnagram("aab", "abb")); // false
