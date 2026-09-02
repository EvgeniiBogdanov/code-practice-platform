// Задача: Определите порядок вывода в консоль

Promise.resolve()
  .then(() => console.log(1))
  .then(() => console.log(2))
  .catch(() => console.log(3))
  .then(() => console.log(4));

Promise.reject()
  .then(() => console.log(5))
  .then(() => console.log(6))
  .catch(() => console.log(7))
  .then(() => console.log(8));

// Ответ: 1, 2, 7, 4, 8
