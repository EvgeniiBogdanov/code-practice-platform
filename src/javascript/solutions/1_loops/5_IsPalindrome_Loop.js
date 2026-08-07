// Вариант 1: Через цикл for (обратный перебор)
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
