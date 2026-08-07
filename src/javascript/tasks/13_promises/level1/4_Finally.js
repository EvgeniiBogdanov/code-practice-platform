// Допишите цепочку так, чтобы независимо от результата
// (успех или ошибка) в консоль выводилось "Запрос завершён"

const fetchData = (shouldFail) =>
  shouldFail ? Promise.reject("Ошибка сети") : Promise.resolve("Данные получены");

fetchData(true)
  .then(console.log)
  .catch(console.error);
  // добавьте finally
