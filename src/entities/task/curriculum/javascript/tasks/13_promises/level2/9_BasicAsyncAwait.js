// Базовое использование async/await
// Напишите асинхронную функцию fetchSum(a, b), которая получает значения чисел с задержкой и возвращает их сумму.

const delayNum = (n) => new Promise((r) => setTimeout(() => r(n), 100));

const fetchSum = async (a, b) => {
  // Решение тут
};

// Пример вызова:
fetchSum(10, 20).then(console.log); // 30
