// charAt(0) для пустой строки вернёт "", а str[0] — undefined (и toUpperCase упадёт)
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Переиспользуем capitalize для каждого слова
const capitalizeWords = (sentence) => sentence.split(" ").map(capitalize).join(" ");

// Пример вызова:
console.log(capitalize("привет")); // "Привет"
console.log(capitalize("")); // ""
console.log(capitalizeWords("hello big world")); // "Hello Big World"
console.log(capitalizeWords("javaScript is FUN")); // "JavaScript Is FUN"
