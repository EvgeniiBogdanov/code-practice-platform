// Возврат из функции map без return
// Что вернёт метод map, если в колбэке нет явного return?

const numbers = [1, 2, 3];
const result = numbers.map((num) => {
  num * 2;
});
console.log(result);
