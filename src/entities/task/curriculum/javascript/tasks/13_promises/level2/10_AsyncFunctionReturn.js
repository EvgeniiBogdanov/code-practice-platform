// Что выведет данный код в консоль и почему?

async function getNumber() {
  return 42;
}

const res = getNumber();
console.log(res);
res.then(console.log);
