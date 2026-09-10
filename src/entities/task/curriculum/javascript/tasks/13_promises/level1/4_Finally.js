// Дополните цепочку вызова fetchData(true) блоком .finally(), который выполняется всегда,
// независимо от результата запроса, выводя в консоль "Запрос завершён".

const fetchData = (shouldFail) =>
  shouldFail ? Promise.reject("Ошибка сети") : Promise.resolve("Данные получены");

// Решение тут:
fetchData(true)
  .then(console.log)
  .catch(console.error);
