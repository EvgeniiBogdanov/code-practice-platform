// Обработка ошибок async/await через try/catch
// Напишите async функцию safeLoad(), перехватывающую ошибку.

const loadData = () => Promise.reject("сервер недоступен");

const safeLoad = async () => {
  // Решение тут
};

// Пример вызова:
safeLoad().then(console.log); // "Не удалось загрузить: сервер недоступен"
