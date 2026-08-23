const debounce = (fn, ms) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, ms);
  };
};

// Пример вызова:
const log = debounce((msg) => console.log(msg), 300);
log("a");
log("b");
log("c");
