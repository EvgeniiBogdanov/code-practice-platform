const throttle = (fn, limit) => {
  let inThrottle = false;

  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// Пример вызова:
const throttled = throttle((val) => console.log(val), 200);
throttled("первый");
throttled("пропущен");
