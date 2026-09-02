// Что выведет данный код в консоль и почему?

let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log("Interval tick:", count);
  if (count === 3) {
    clearInterval(intervalId);
  }
}, 1000);

setTimeout(() => {
  console.log("Timeout finished");
}, 5000);
