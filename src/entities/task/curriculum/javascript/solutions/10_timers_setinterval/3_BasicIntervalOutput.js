let count = 0;

const intervalId = setInterval(() => {
  count++;
  console.log(count);
  if (count === 3) {
    clearInterval(intervalId);
  }
}, 1000);

// Порядок вывода в консоль:
// 1 (через 1000 мс)
// 2 (через 2000 мс)
// 3 (через 3000 мс, затем clearInterval останавливает интервал)

