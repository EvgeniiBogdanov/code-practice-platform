// Что выведет данный код в консоль и почему?

Promise.reject("Ошибка")
  .catch((err) => {
    console.log("Поймано:", err);
    return "Восстановлено";
  })
  .then((val) => console.log("Дальше:", val));
