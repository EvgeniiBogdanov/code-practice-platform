const loadData = (success) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) resolve("Данные получены");
      else reject(new Error("Ошибка сети"));
    }, 500);
  }).finally(() => {
    console.log("Загрузка завершена");
  });
};

// Пример вызова:
loadData(true)
  .then(console.log)
  .catch(console.error);
// "Загрузка завершена"
// "Данные получены"
