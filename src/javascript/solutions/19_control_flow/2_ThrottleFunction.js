function throttle(fn, ms) {
  let isThrottled = false;
  let savedArgs = null;
  let savedThis = null;

  function wrapper(...args) {
    if (isThrottled) {
      savedArgs = args;
      savedThis = this;
      return;
    }

    fn.apply(this, args);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = null;
        savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

// Пример использования:
const onScroll = throttle((val) => console.log("Scroll:", val), 100);

onScroll(1); // Вызовется сразу (1)
onScroll(2);
onScroll(3); // Вызовется через 100 мс с аргументом 3
