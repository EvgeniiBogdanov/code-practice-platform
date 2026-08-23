// Цикл с var и асинхронный вызов
// Что выведет данный код?
// Варианты, как исправить?

for (var i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i);
  });
}
