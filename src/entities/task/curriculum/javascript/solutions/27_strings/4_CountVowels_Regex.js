// match с флагом g возвращает массив совпадений или null, если совпадений нет
const countVowels = (str) => str.match(/[аеёиоуыэюяaeiou]/gi)?.length ?? 0;

// Пример вызова:
console.log(countVowels("Привет, мир!")); // 3
console.log(countVowels("JavaScript")); // 3
console.log(countVowels("ЁЖИК")); // 2
console.log(countVowels("")); // 0
