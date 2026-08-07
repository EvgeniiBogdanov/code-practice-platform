// Решение 2: Использование IIFE (Immediately Invoked Function Expression)

for (var i = 0; i < 10; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j); // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    });
  })(i);
}
