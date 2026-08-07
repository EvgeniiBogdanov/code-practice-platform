// Базовый синтаксис свертки массива с помощью reduce
const arr = [1, 2, 3];
const result = arr.reduce((acc, item) => {
  return acc + item;
}, 0);

console.log(result);
