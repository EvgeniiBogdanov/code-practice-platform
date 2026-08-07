// Вариант 1: Через цикл for...of
const arr = ["кофе", "сок", "газировка", "вода"];

const filterStr = (arr, num) => {
  let result = [];

  for (let str of arr) {
    if (str.length > num) {
      result.push(str);
    }
  }
  return result;
};

const result = filterStr(arr, 5);
console.log(result);
