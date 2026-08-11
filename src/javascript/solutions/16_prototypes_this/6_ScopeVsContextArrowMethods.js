const timer = {
  seconds: 0,
  start() {
    setTimeout(() => {
      this.seconds++;
      console.log(this.seconds); // 1
    }, 100);
  },
};

timer.start();
