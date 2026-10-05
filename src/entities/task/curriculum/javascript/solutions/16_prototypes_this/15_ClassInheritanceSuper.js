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
    super(name); // сначала отрабатывает конструктор родителя
    console.log("Dog constructor");
  }

  speak() {
    // super.speak() — метод родителя, вызванный с текущим this
    return `${super.speak()}: гав!`;
  }
}

const dog = new Dog("Шарик"); // "Animal constructor: Шарик", затем "Dog constructor"
console.log(dog.speak()); // "Шарик издаёт звук: гав!"
console.log(dog.description); // "Это Шарик" — геттер унаследован
console.log(Dog.kingdom); // "Животные" — статические члены тоже наследуются
console.log(Object.getPrototypeOf(Dog) === Animal); // true — класс наследует класс
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype); // true — экземпляры наследуют методы
console.log(typeof Dog); // "function" — класс это функция

class Cat extends Animal {
  constructor(name) {
    try {
      this.name = name; // this ещё не создан: его создаёт super()
    } catch (error) {
      console.log(error.name); // "ReferenceError"
    }
    super(name); // "Animal constructor: Мурка"
  }
}
new Cat("Мурка");

console.log(Object.hasOwn(dog, "speak")); // false — метод лежит в Dog.prototype
console.log("speak" in dog); // true — in проверяет всю цепочку прототипов
