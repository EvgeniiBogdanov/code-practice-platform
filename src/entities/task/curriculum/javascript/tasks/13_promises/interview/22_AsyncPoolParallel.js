// Параллельный пул задач с ограничением (asyncPool)
// Напишите функцию asyncPool(count, tasks), ограничивающую параллельное выполнение.

const asyncPool = async (count, tasks) => {
  // Решение тут
};

// Пример вызова:
const sleep = (ms, v) => () => new Promise((r) => setTimeout(() => r(v), ms));
const tasks = [sleep(50, "a"), sleep(10, "b"), sleep(20, "c")];

asyncPool(2, tasks).then(console.log); // ["a", "b", "c"]
