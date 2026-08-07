// Реактивность (Observable / Signal)

let currentEffect = null;

const effect = (fn) => {
  currentEffect = fn;
  fn();
  currentEffect = null;
};

const createSignal = (initialValue) => {
  let value = initialValue;
  const subscriptions = new Set();

  const get = () => {
    if (currentEffect) {
      subscriptions.add(currentEffect);
    }
    return value;
  };

  const set = (newValue) => {
    if (value !== newValue) {
      value = typeof newValue === "function" ? newValue(value) : newValue;
      subscriptions.forEach((sub) => sub());
    }
  };

  return [get, set];
};

const [count, setCount] = createSignal(0);

effect(() => {
  console.log("Count changed:", count());
});
// Выведет: Count changed: 0

setCount(1); // Выведет: Count changed: 1
setCount(2); // Выведет: Count changed: 2
