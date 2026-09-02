console.log("Начало"); // Начало

const promise1 = Promise.resolve().then(() => {
  console.log("Промис 1"); // Промис 1
  setTimeout(() => {
    console.log("Таймер 2"); // Таймер 2
  }, 0);
});

const timer1 = setTimeout(() => {
  console.log("Таймер 1"); // Таймер 1
  Promise.resolve().then(() => {
    console.log("Промис 2"); // Промис 2
  });
}, 0);

console.log("Конец"); // Конец
// Порядок вывода: Начало, Конец, Промис 1, Таймер 1, Промис 2, Таймер 2
