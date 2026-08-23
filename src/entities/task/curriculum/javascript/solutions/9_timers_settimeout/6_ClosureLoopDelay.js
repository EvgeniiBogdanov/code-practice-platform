for (var i = 1; i <= 3; i++) {
  setTimeout(() => {
    console.log(i); // 4, 4, 4
  }, i * 1000);
}
