// Что выведет данный код в консоль и почему?

function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  return `Hello, ${this.name}`;
};

const alice = new Person("Alice");

Person.prototype = {
  greet() {
    return `Hi, ${this.name}!`;
  },
};

const bob = new Person("Bob");

console.log(alice.greet());
console.log(bob.greet());
