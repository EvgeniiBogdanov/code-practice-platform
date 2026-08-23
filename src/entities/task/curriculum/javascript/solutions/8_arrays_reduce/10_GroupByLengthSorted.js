const groupByLength = (words) => {
  return words.reduce((acc, word) => {
    const len = word.length;
    acc[len] ??= [];
    acc[len].push(word);
    return acc;
  }, {});
};

// Пример вызова:
console.log(groupByLength(["стол", "стул", "шкаф", "кот", "дом", "крокодил", "бегемот"]));
// {
//   "3": ["кот", "дом"],
//   "4": ["стол", "стул", "шкаф"],
//   "7": ["бегемот"],
//   "8": ["крокодил"]
// }
