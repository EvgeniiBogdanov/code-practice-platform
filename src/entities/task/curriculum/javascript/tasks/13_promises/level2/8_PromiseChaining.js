// Что выведет данный код в консоль и почему?

Promise.resolve(1)
  .then((x) => x + 1)
  .then((x) => {
    throw new Error("Ошибка в цепочке");
  })
  .catch((err) => {
    console.log(err.message);
    return 10;
  })
  .then((x) => console.log(x));
