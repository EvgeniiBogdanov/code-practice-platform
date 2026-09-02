// Что выведет данный код в консоль и почему?

let isLoading = true;

Promise.resolve("Данные получены")
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log("Ошибка:", err);
  })
  .finally(() => {
    isLoading = false;
    console.log("isLoading:", isLoading);
  });
