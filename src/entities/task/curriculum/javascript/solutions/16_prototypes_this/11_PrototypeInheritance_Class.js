// То же наследование на синтаксисе class — под капотом те же прототипы
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} издаёт звук`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    return `${this.name} лает`;
  }

  getBreed() {
    return this.breed;
  }
}

// Пример вызова:
const dog = new Dog("Шарик", "дворняга");
console.log(dog.speak()); // "Шарик лает"
console.log(dog.getBreed()); // "дворняга"
console.log(Animal.prototype.speak.call(dog)); // "Шарик издаёт звук"
console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true
console.log(dog.constructor === Dog); // true
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype); // true
console.log(Object.hasOwn(dog, "speak")); // false
