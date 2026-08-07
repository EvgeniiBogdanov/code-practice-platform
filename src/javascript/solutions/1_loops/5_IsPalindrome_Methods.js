// Вариант 2: С помощью методов массивов
const isPalindrome = (str) => {
  const strLowerCase = str.toLowerCase();
  const reverse = [...strLowerCase].reverse().join("");
  return strLowerCase === reverse;
};

const result = isPalindrome("Madam");
console.log(result);
