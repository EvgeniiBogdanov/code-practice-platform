// Каков будет порядок вывода в консоль и почему?

Promise.resolve()
  .then(() => {
    console.log("then 1");
    return Promise.resolve("nested promise");
  })
  .then((res) => {
    console.log("then 2:", res);
  });

Promise.resolve()
  .then(() => {
    console.log("then 3");
  })
  .then(() => {
    console.log("then 4");
  });
