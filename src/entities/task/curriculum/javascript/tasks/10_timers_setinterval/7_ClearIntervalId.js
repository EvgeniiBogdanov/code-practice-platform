// Что выведет данный код в консоль и почему?

let count = 0;
const id = setInterval(() => {
  count++;
  console.log(count);
}, 1000);

clearInterval(id);
console.log("Cleared");
