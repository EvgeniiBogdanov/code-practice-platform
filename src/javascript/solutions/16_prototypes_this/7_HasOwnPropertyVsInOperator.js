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

console.log(myDog.hasOwnProperty("name")); // true (собственное свойство)
console.log(myDog.hasOwnProperty("sound")); // false (метод прототипа)

console.log("name" in myDog); // true
console.log("sound" in myDog); // true (проверяет свойство в цепочке прототипов)
