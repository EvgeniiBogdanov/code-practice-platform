const removeAdjacentDuplicates = (s) => {
  const stack = [];

  for (const char of s) {
    if (stack[stack.length - 1] === char) {
      stack.pop();
    } else {
      stack.push(char);
    }
  }

  return stack.join("");
};

// Пример вызова:
console.log(removeAdjacentDuplicates("abbaca")); // "ca"
console.log(removeAdjacentDuplicates("azxxzy")); // "ay"
console.log(removeAdjacentDuplicates("a")); // "a"
