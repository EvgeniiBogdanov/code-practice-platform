// Вариант без методов массивов: проход с конца строки
const reverseString = (str) => {
  let result = "";
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
};

const reverseWords = (sentence) => {
  const words = sentence.split(" ").filter((word) => word !== "");
  let result = "";
  for (let i = words.length - 1; i >= 0; i--) {
    result += i === words.length - 1 ? words[i] : ` ${words[i]}`;
  }
  return result;
};

// Пример вызова:
console.log(reverseString("hello")); // "olleh"
console.log(reverseString("")); // ""
console.log(reverseWords("я учу JavaScript")); // "JavaScript учу я"
console.log(reverseWords("  много   пробелов  ")); // "пробелов много"
