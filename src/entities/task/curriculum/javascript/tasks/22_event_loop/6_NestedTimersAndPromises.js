// Каков будет порядок вывода в консоль и почему?

console.log("Начало");

const promise1 = Promise.resolve().then(() => {
  console.log("Промис 1");
  setTimeout(() => {
    console.log("Таймер 2");
  }, 0);
});

const timer1 = setTimeout(() => {
  console.log("Таймер 1");
  Promise.resolve().then(() => {
    console.log("Промис 2");
  });
}, 0);

console.log("Конец");
