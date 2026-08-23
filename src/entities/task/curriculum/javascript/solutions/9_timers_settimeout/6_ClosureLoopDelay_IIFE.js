for (var i = 1; i <= 3; i++) {
  (function (j) {
    setTimeout(() => {
      console.log(j);
    }, j * 1000);
  })(i);
}
// 1
// 2
// 3
