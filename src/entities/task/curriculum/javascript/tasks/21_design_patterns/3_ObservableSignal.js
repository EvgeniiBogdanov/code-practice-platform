// Реактивный сигнал (Signal / Observable value)
// Реализуйте функцию createSignal(initialValue), возвращающую пару [get, set], а также метод effect(fn) для автоматического отслеживания зависимостей.

const createSignal = (initialValue) => {
  // Решение тут
};

// Пример вызова:
const [count, setCount] = createSignal(0);
console.log(count()); // 0
setCount(5);
console.log(count()); // 5
