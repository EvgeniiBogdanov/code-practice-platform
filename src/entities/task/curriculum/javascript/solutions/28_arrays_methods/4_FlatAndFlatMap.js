// flat() по умолчанию убирает один уровень
const flattenOnce = (arr) => arr.flat();

// Infinity — убрать вложенность любой глубины
const flattenAll = (arr) => arr.flat(Infinity);

// flatMap = map + flat(1): каждый пост превращается в массив тегов, массивы склеиваются
const getAllTags = (posts) => posts.flatMap((post) => post.tags);

const splitWords = (sentences) => sentences.flatMap((sentence) => sentence.split(" "));

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
