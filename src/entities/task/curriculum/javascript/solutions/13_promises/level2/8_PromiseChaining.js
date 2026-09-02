Promise.resolve(5)
  .then((num) => num * 2)
  .then((num) => num + 10)
  .then((res) => console.log(res)); // 20
