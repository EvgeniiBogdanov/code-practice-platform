// Реактивный сигнал (Signal / Observable value)
// Реализуйте функцию createSignal(initialValue), возвращающую массив [get, set, subscribe]:
// - get() возвращает текущее значение;
// - set(nextValue) обновляет значение (поддерживая прямое значение или колбэк-функцию обновления) и уведомляет подписчиков;
// - subscribe(fn) регистрирует функцию-слушатель и возвращает функцию отписки.

const createSignal = (initialValue) => {
  // Решение тут
};

// Пример вызова:
const [getCount, setCount, subscribe] = createSignal(0);
subscribe((val) => console.log("Count changed:", val));
setCount(1); // Count changed: 1
setCount(2); // Count changed: 2
