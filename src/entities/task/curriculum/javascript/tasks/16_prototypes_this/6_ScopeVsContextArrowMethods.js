// Вложенные стрелочные функции и lexical this
// Что выведет данный код?

const timer = {
  seconds: 0,
  start() {
    setTimeout(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 100);
  },
};

timer.start();
