function Animal(name) {
  this.name = name;
}

// Методы кладём в прототип: одна функция на все экземпляры
Animal.prototype.speak = function () {
  return `${this.name} издаёт звук`;
};

function Dog(name, breed) {
  Animal.call(this, name); // аналог super(name): инициализируем поля родителя
  this.breed = breed;
}

// Цепочка: dog -> Dog.prototype -> Animal.prototype -> Object.prototype
Dog.prototype = Object.create(Animal.prototype);
// Object.create дал объект без собственного constructor — восстанавливаем
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function () {
  return `${this.name} лает`;
};

Dog.prototype.getBreed = function () {
  return this.breed;
};

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
