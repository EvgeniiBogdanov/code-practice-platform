// Что выведет данный код в консоль и почему?

function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  return `Привет, я ${this.name}`;
};

const anna = new Person("Анна");

Person.prototype = {
  greet() {
    return `Здравствуйте, я ${this.name}`;
  },
};

const ivan = new Person("Иван");

console.log(anna.greet());
console.log(ivan.greet());
