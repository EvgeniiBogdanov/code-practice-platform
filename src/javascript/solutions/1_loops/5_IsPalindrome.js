// Смотрите отдельные файлы решений:
// 1. 5_IsPalindrome_Loop.js (Через цикл for)
// 2. 5_IsPalindrome_Methods.js (С помощью методов массивов)

const isPalindrome = (str) => {
  let lowerStr = str.toLowerCase();
  let reverseString = "";

  for (let i = str.length - 1; i >= 0; i--) {
    reverseString += lowerStr[i];
  }

  return reverseString === lowerStr;
};

const result = isPalindrome("Madam");
console.log(result);
