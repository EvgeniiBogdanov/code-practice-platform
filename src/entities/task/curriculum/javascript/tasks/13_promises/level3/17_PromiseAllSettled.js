// Безопасная загрузка данных через Promise.allSettled
// Напишите функцию fetchSafeDashboard(promises), которая ожидает выполнения всех промисов и возвращает массив только успешно полученных значений.

const fetchSafeDashboard = async (promises) => {
  // Решение тут
};

// Пример вызова:
const p1 = Promise.resolve("Данные 1");
const p2 = Promise.reject("Ошибка сети");
const p3 = Promise.resolve("Данные 3");

fetchSafeDashboard([p1, p2, p3]).then(console.log); // [ "Данные 1", "Данные 3" ]
