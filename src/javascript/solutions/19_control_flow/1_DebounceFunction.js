const debounce = (fn, wait, immediate = false) => {
  let timeout;

  const debounced = function (...args) {
    const callNow = immediate && !timeout;
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) fn.apply(this, args);
    }, wait);

    if (callNow) fn.apply(this, args);
  };

  debounced.cancel = () => {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
};

// Пример вызова:
const log = debounce((val) => console.log(val), 200);
log(1);
log(2);
log(3);
