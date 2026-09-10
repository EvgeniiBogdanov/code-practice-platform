// Что выведет данный код в консоль и почему? Как исправить потерю контекста?

const counter = {
  count: 10,
  increment() {
    this.count++;
    return this.count;
  },
};

const inc = counter.increment;
console.log(inc());
