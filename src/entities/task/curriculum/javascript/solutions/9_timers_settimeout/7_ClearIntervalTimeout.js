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

// Порядок вывода в консоль:
// Interval tick: 1 (через 1000 мс)
// Interval tick: 2 (через 2000 мс)
// Interval tick: 3 (через 3000 мс, затем clearInterval останавливает интервал)
// Timeout finished (через 5000 мс)

