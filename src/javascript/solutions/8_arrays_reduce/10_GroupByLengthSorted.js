const words = ["тест", "привет", "фoo", "бар"];

const groupBy = (arr) => {
  return arr.reduce((acc, word) => {
    acc[word.length] ??= [];
    acc[word.length].push(word);
    acc[word.length].sort();

    return acc;
  }, {});
};

console.log(groupBy(words));
