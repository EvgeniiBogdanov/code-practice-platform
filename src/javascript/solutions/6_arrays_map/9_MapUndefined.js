// В map callback без return возвращает undefined для нечётных элементов
const arr = [1, 2, 3];

const result = arr.map((num) => {
  if (num % 2 === 0) return num;
});

console.log(result); // [undefined, 2, undefined]
