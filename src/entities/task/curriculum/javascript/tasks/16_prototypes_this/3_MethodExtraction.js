// Что выведет данный код в консоль и почему?

const counter = {
  count: 10,
  inc() {
    this.count++;
    return this.count;
  },
};

const increment = counter.inc;
console.log(counter.inc());
console.log(increment());
