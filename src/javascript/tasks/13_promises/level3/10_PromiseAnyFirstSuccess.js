// Поиск первого успешного промиса через Promise.any
// Напишите функцию getFastestSuccess(promises), возвращающую результат первого выполнившегося промиса.

const getFastestSuccess = (promises) => {
  // Решение тут
};

// Пример вызова:
const p1 = new Promise((_, reject) => setTimeout(() => reject("Ошибка 1"), 100));
const p2 = new Promise((resolve) => setTimeout(() => resolve("Быстрый успех"), 200));
const p3 = new Promise((resolve) => setTimeout(() => resolve("Медленный успех"), 500));

getFastestSuccess([p1, p2, p3]).then(console.log); // "Быстрый успех"
