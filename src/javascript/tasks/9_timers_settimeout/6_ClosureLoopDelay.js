// Вопрос: Что выведет этот код и как исправить ?

for (var i = 1; i <= 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, i * 1000);
}
