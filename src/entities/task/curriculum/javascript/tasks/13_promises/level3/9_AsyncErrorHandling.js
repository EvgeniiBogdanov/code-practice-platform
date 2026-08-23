// Обработка ошибок в async/await через try/catch
// Напишите async функцию safeFetch(fetchFn), которая возвращает { data, error }.

const safeFetch = async (fetchFn) => {
  // Решение тут
};

// Пример вызова:
safeFetch(() => Promise.resolve("OK")).then(console.log); // { data: "OK", error: null }
safeFetch(() => Promise.reject("Fail")).then(console.log); // { data: null, error: "Fail" }
