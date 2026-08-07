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

console.log(pedro.getName()); // "Pedro"
try {
  console.log(juan.getName());
} catch (e) {
  console.log("juan.getName is not a function"); // Ошибка! juan был создан до подмены Person.prototype
}
