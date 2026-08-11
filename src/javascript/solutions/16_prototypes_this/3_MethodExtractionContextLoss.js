const counter = {
  count: 10,
  increment() {
    this.count++;
    return this.count;
  },
};

const inc = counter.increment.bind(counter);
console.log(inc()); // 11
