// Замыкание в цикле с var
// Что выведет следующий код?

for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
