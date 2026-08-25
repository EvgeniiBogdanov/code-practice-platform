// Что выведет следующий код и как его исправить?

const counter = {
  count: 10,
  increment() {
    this.count++;
    return this.count;
  },
};

const inc = counter.increment;
console.log(inc());
