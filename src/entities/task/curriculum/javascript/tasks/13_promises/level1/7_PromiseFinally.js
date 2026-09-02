// Что выведет данный код в консоль и почему?

Promise.resolve("Данные")
  .finally(() => {
    console.log("Очистка ресурсов");
  })
  .then((val) => console.log("Результат:", val));
