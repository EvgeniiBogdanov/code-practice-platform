// Очистка интервала по идентификатору
// Что выведет данный код?

let count = 0;
const id = setInterval(() => {
  count++;
  console.log(count);
}, 1000);

clearInterval(id);
console.log("Cleared");
