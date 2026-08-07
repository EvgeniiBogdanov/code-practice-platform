const words = ["cat", "dog", "apple", "hi"];

const findLongWord = (arr, num) => arr.find((word) => word.length > num);

const result = findLongWord(words, 4);
console.log(result);
