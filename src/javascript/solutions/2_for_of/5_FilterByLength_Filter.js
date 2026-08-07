// Вариант 2: Через метод массива filter()
const arr = ["кофе", "сок", "газировка", "вода"];

const filterStr = (arr, num) => arr.filter((str) => str.length > num);

console.log(filterStr(arr, 5));
