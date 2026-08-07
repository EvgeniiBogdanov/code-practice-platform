// Вариант 1: Через цикл for...of
const water = ["кофе", "сок", "газировка", "вода", "кофе", "кофе"];

const sumDoubleStr = (arr, str) => {
  let count = 0;

  for (const item of arr) {
    if (item === str) {
      count++;
    }
  }
  return count;
};

const result = sumDoubleStr(water, "кофе");
console.log(result);
