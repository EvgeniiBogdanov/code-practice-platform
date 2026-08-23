const fetchData = (shouldFail) =>
  shouldFail ? Promise.reject("Ошибка сети") : Promise.resolve("Данные получены");

fetchData(true)
  .then(console.log)
  .catch(console.error)
  .finally(() => console.log("Запрос завершён"));
