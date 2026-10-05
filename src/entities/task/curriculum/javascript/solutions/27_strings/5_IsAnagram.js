const normalize = (str) => str.toLowerCase().replace(/\s/g, "");

// Частотный словарь: +1 для символов первой строки, -1 для второй
const isAnagram = (a, b) => {
  const first = normalize(a);
  const second = normalize(b);
  if (first.length !== second.length) {
    return false;
  }

  const counts = new Map();
  for (const char of first) {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }

  for (const char of second) {
    const count = counts.get(char);
    if (!count) {
      return false; // символа нет или он уже «израсходован»
    }
    counts.set(char, count - 1);
  }

  return true;
};

// Пример вызова:
console.log(isAnagram("listen", "silent")); // true
console.log(isAnagram("Апельсин", "спаниель")); // true
console.log(isAnagram("Dormitory", "dirty room")); // true
console.log(isAnagram("hello", "world")); // false
console.log(isAnagram("aab", "abb")); // false
