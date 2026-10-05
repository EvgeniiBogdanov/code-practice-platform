const interval = (fn, delay) => {
  let timerId = null;
  let isStopped = false;

  const tick = () => {
    fn();
    // Следующий запуск планируем только ПОСЛЕ выполнения fn и только если не остановлены
    if (!isStopped) {
      timerId = setTimeout(tick, delay);
    }
  };

  timerId = setTimeout(tick, delay);

  return () => {
    isStopped = true; // нужно, если stop вызван изнутри fn: clearTimeout там ещё нечего очищать
    clearTimeout(timerId);
  };
};

// Пример вызова:
let ticks = 0;
const stop = interval(() => {
  ticks++;
  console.log(`tick ${ticks}`);
}, 100);

setTimeout(() => {
  stop();
  console.log(`Остановлено после ${ticks} тиков`); // "Остановлено после 3 тиков"
}, 350);

let calls = 0;
const stopSelf = interval(() => {
  calls++;
  if (calls === 2) {
    stopSelf();
  }
}, 50);

setTimeout(() => {
  console.log(`Самоостановка после ${calls} вызовов`); // "Самоостановка после 2 вызовов"
}, 400);
