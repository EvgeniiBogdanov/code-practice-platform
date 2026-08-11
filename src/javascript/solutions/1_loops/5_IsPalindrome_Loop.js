const isPalindrome = (str) => {
  let lowerStr = str.toLowerCase();
  let reverseString = "";

  for (let i = str.length - 1; i >= 0; i--) {
    reverseString += lowerStr[i];
  }

  return reverseString === lowerStr;
};

// Пример вызова:
console.log(isPalindrome("Madam")); // true
console.log(isPalindrome("Hello")); // false
