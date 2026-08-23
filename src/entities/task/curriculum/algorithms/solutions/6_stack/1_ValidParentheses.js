const isValid = (s) => {
  const stack = [];
  const pairs = {
    '(': ')',
    '[': ']',
    '{': '}',
  };

  for (const char of s) {
    const expectedClose = pairs[char];
    const isOpen = expectedClose !== undefined;

    isOpen ? stack.push(expectedClose) : null;

    if (!isOpen) {
      const last = stack.pop();
      const isMatch = last === char;
      if (!isMatch) return false;
    }
  }

  return !stack.length;
};

// Пример вызова:
console.log(isValid("()"));     // true
console.log(isValid("()[]{}")); // true
console.log(isValid("(]"));     // false
console.log(isValid("([])"));   // true
