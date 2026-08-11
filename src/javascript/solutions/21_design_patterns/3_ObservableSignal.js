const createSignal = (initialValue) => {
  let value = initialValue;
  const subscribers = new Set();

  const get = () => value;
  const set = (nextValue) => {
    value = typeof nextValue === "function" ? nextValue(value) : nextValue;
    subscribers.forEach((fn) => fn(value));
  };
  const subscribe = (fn) => {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  };

  return [get, set, subscribe];
};

// Пример вызова:
const [getCount, setCount, subscribe] = createSignal(0);
subscribe((val) => console.log("Count changed:", val));
setCount(1); // Count changed: 1
setCount(2); // Count changed: 2
