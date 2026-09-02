// Обработка отклонения промиса через catch
// Напишите функцию getRejectedPromise(reason), возвращающую отклоненный промис с переданной причиной reason.

const getRejectedPromise = (reason) => {
  // Решение тут
};

// Пример вызова:
getRejectedPromise(new Error("Ошибка сервера"))
  .catch((err) => console.log("Поймано:", err.message));
