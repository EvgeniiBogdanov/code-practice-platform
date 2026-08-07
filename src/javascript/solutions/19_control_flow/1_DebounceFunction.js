function debounce(fn, ms, options = { leading: false, trailing: true }) {
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;

    const isFirstCall = !timerId;

    if (timerId) clearTimeout(timerId);

    if (isFirstCall && options.leading) {
      fn.apply(lastThis, lastArgs);
    }

    timerId = setTimeout(() => {
      if (options.trailing && (!isFirstCall || !options.leading)) {
        fn.apply(lastThis, lastArgs);
      }
      timerId = null;
    }, ms);
  }

  debounced.cancel = function () {
    if (timerId) clearTimeout(timerId);
    timerId = null;
    lastArgs = null;
    lastThis = null;
  };

  return debounced;
}

// Пример использования:
const log = debounce((val) => console.log(val), 200, { leading: true });
log("A");
log("B");
log("C");
