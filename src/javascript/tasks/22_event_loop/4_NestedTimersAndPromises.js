// Вложенные таймеры внутри промисов и наоборот
// В каком порядке выведутся строки?

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
