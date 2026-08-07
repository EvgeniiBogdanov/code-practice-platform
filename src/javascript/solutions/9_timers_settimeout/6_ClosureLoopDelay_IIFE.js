// Вариант 2 (Замыкание / IIFE): Замыкание переменной в функцию

for (var i = 1; i <= 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j);
    }, j * 1000);
  })(i);
}
