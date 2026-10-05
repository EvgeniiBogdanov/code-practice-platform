// Строки неизменяемы: превращаем в массив символов, разворачиваем, склеиваем обратно
const reverseString = (str) => [...str].reverse().join("");

// split(/\s+/) делит по любому количеству пробелов; trim убирает пробелы по краям
const reverseWords = (sentence) => sentence.trim().split(/\s+/).reverse().join(" ");

// Пример вызова:
console.log(reverseString("hello")); // "olleh"
console.log(reverseString("")); // ""
console.log(reverseWords("я учу JavaScript")); // "JavaScript учу я"
console.log(reverseWords("  много   пробелов  ")); // "пробелов много"
