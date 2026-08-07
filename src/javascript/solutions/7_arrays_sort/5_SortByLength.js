const words = ["apple", "hi", "banana", "cat"];

const sortByLength = (arr) => arr.sort((a, b) => a.length - b.length);

const result = sortByLength(words);
console.log(result); // ["hi", "cat", "apple", "banana"]
