const isAnagram = (s, t) => {
  if (s.length !== t.length) {
    return false;
  }

  const map = new Map();

  for (const char of s) {
    map.set(char, (map.get(char) || 0) + 1);
  }

  for (const char of t) {
    if (!map.has(char) || map.get(char) === 0) {
      return false;
    }
    map.set(char, map.get(char) - 1);
  }

  return true;
};

// Пример вызова:
console.log(isAnagram("dusty", "study")); // true
console.log(isAnagram("night", "thing")); // true
console.log(isAnagram("hello", "world")); // false
console.log(isAnagram("aab", "abb"));     // false
