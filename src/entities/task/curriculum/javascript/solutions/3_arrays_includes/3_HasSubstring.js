const hasSubstring = (str, substr) => {
  return str.includes(substr);
};

// Пример вызова:
console.log(hasSubstring("hello world", "world")); // true
console.log(hasSubstring("hello world", "js"));    // false
