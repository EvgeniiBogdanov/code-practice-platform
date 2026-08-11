// Использование метода finally
// Напишите функцию loadData(success), которая возвращает Promise,
// а в блоке .finally() выводит "Загрузка завершена".

const loadData = (success) => {
  // Решение тут
};

// Пример вызова:
loadData(true)
  .then(console.log)
  .catch(console.error);
