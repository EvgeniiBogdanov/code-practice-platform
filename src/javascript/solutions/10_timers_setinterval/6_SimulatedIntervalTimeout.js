const interval = (fn, delay) => {
  let timerId;
  const run = () => {
    fn();
    timerId = setTimeout(run, delay);
  };
  timerId = setTimeout(run, delay);
  return () => clearTimeout(timerId);
};

// Пример вызова:
const stop = interval(() => console.log("tick"), 1000);
setTimeout(stop, 3500);
