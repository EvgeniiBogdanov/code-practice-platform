// Что выведет данный код в консоль и почему?

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
