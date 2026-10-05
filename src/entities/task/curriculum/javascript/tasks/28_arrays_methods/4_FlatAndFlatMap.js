// Методы flat и flatMap
// Реализуйте функции с помощью встроенных flat и flatMap:
// 1. flattenOnce(arr) — убирает один уровень вложенности
// 2. flattenAll(arr) — убирает вложенность любой глубины
// 3. getAllTags(posts) — массив всех тегов из всех постов
// 4. splitWords(sentences) — массив всех слов из массива предложений

const flattenOnce = (arr) => {
  // Решение тут
};

const flattenAll = (arr) => {
  // Решение тут
};

const getAllTags = (posts) => {
  // Решение тут
};

const splitWords = (sentences) => {
  // Решение тут
};

// Пример вызова:
console.log(flattenOnce([1, [2, 3], [4, [5]]])); // [1, 2, 3, 4, [5]]
console.log(flattenAll([1, [2, [3, [4, [5]]]]])); // [1, 2, 3, 4, 5]

const posts = [
  { title: "JS", tags: ["js", "frontend"] },
  { title: "CSS", tags: ["css"] },
  { title: "Черновик", tags: [] },
];
console.log(getAllTags(posts)); // ["js", "frontend", "css"]
console.log(splitWords(["Привет мир", "Учим JS"])); // ["Привет", "мир", "Учим", "JS"]
