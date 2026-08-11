// Паттерн Signal (Реактивное состояние)
// Реализуйте функцию createSignal(initialValue), возвращающую [get, set, subscribe].

const createSignal = (initialValue) => {
  // Решение тут
};

// Пример вызова:
const [getCount, setCount, subscribe] = createSignal(0);
subscribe((val) => console.log("Count changed:", val));
setCount(1); // Count changed: 1
setCount(2); // Count changed: 2
