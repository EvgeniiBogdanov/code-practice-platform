const isPalindrome = (s) => {
  const isAlphanumeric = (char) => /[a-z0-9]/i.test(char);

  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    while (left < right && !isAlphanumeric(s[left])) {
      left++;
    }
    while (left < right && !isAlphanumeric(s[right])) {
      right--;
    }

    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }

    left++;
    right--;
  }

  return true;
};

// Пример вызова:
console.log(isPalindrome("Was it a car or a cat I saw?")); // true
console.log(isPalindrome("Step on no pets!"));             // true
console.log(isPalindrome("Hello, world"));                 // false
console.log(isPalindrome("?!"));                           // true
