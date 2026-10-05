// Set даёт проверку принадлежности за O(1)
const VOWELS = new Set("аеёиоуыэюяaeiou");

const countVowels = (str) => {
  let count = 0;
  for (const char of str.toLowerCase()) {
    if (VOWELS.has(char)) {
      count++;
    }
  }
  return count;
};

// Пример вызова:
console.log(countVowels("Привет, мир!")); // 3
console.log(countVowels("JavaScript")); // 3
console.log(countVowels("ЁЖИК")); // 2
console.log(countVowels("")); // 0
