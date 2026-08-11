// Несколько интервалов и общий счетчик
// Что будет выводиться в консоль?

let counter = 0;

function startInterval() {
  return setInterval(() => {
    counter++;
    console.log(`Counter: ${counter}`);
  }, 1000);
}

const id1 = startInterval();
const id2 = startInterval();

setTimeout(() => {
  clearInterval(id1);
  console.log("Stopped first interval");
}, 2500);
