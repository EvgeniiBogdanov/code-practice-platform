// Завершающий блок finally
// Допишите цепочку так, чтобы независимо от результата выводилось "Запрос завершён".

const fetchData = (shouldFail) =>
  shouldFail ? Promise.reject("Ошибка сети") : Promise.resolve("Данные получены");

// Решение тут

// Пример вызова:
fetchData(true);
