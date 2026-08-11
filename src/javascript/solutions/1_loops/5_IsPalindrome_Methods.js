const isPalindrome = (str) => {
  const strLowerCase = str.toLowerCase();
  const reverse = [...strLowerCase].reverse().join("");
  return strLowerCase === reverse;
};

// Пример вызова:
console.log(isPalindrome("Madam")); // true
console.log(isPalindrome("Hello")); // false
