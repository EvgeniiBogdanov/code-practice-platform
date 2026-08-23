// Потеря контекста при извлечении метода
// Что выведет код и как его исправить с помощью bind?

const counter = {
  count: 10,
  increment() {
    this.count++;
    return this.count;
  },
};

const inc = counter.increment;
console.log(inc());
