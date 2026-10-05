// Что выведет данный код в консоль и почему?
// Если строка бросает ошибку — напишите имя ошибки.

class Animal {
  static kingdom = "Животные";

  constructor(name) {
    this.name = name;
    console.log(`Animal constructor: ${name}`);
  }

  speak() {
    return `${this.name} издаёт звук`;
  }

  get description() {
    return `Это ${this.name}`;
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name);
    console.log("Dog constructor");
  }

  speak() {
    return `${super.speak()}: гав!`;
  }
}

const dog = new Dog("Шарик");
console.log(dog.speak());
console.log(dog.description);
console.log(Dog.kingdom);
console.log(Object.getPrototypeOf(Dog) === Animal);
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype);
console.log(typeof Dog);

class Cat extends Animal {
  constructor(name) {
    try {
      this.name = name;
    } catch (error) {
      console.log(error.name);
    }
    super(name);
  }
}
new Cat("Мурка");

console.log(Object.hasOwn(dog, "speak"));
console.log("speak" in dog);
