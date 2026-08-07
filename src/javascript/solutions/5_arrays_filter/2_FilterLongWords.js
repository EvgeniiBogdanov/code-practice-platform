const words = ["hi", "hello", "cat", "dog"];

const filterLongWords = (arr, num) => arr.filter((word) => word.length > num);

const result = filterLongWords(words, 3);
console.log(result);
