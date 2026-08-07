function Person(name) {
  this.name = name;
}

const juan = new Person("Juan");

Person.prototype = {
  getName: function () {
    return this.name;
  },
};

const pedro = new Person("Pedro");

console.log(pedro.getName());
console.log(juan.getName());
