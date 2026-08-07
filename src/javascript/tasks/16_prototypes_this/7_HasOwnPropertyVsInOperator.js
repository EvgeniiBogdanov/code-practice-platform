// Разница hasOwnProperty и in
// Что будет выведено в консоль

class Animal {
  constructor(name) {
    this.name = name;
  }

  sound() {
    console.log("Some sound");
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  bark() {
    console.log("Woof woof!");
  }
}

let myDog = new Dog("Buddy", "Labrador");

console.log(myDog.hasOwnProperty("name")); // ?
console.log(myDog.hasOwnProperty("sound")); // ?

console.log("name" in myDog); // ?
console.log("sound" in myDog); // ?
