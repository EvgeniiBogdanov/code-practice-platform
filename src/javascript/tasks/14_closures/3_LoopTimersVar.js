// Цикл с var и асинхронный вызов
// Что выведет данный код?

for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
