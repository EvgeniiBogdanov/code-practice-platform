// Последовательный асинхронный цикл
// Напишите функцию processArray(items, asyncFn), обрабатывающую элементы строго последовательно.

const delayLog = (item) =>
  new Promise((r) => setTimeout(() => { console.log(item); r(); }, 50));

const processArray = async (items, asyncFn) => {
  // Решение тут
};

// Пример вызова:
processArray(["a", "b", "c"], delayLog);
