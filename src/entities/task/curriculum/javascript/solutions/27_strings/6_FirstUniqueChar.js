const firstUniqueChar = (str) => {
  // Проход 1: считаем, сколько раз встречается каждый символ
  const counts = new Map();
  for (const char of str) {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }

  // Проход 2: идём в исходном порядке и возвращаем первый символ с частотой 1
  for (const char of str) {
    if (counts.get(char) === 1) {
      return char;
    }
  }

  return null;
};

// Пример вызова:
console.log(firstUniqueChar("swiss"));   // "w"
console.log(firstUniqueChar("racecar")); // "e"
console.log(firstUniqueChar("aabb"));    // null
console.log(firstUniqueChar(""));        // null
