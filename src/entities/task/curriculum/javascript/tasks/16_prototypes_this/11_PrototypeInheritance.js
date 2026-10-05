// Наследование через прототипы (без class)
// 1. Конструктор Animal(name) сохраняет имя; метод прототипа speak() возвращает "<name> издаёт звук".
// 2. Конструктор Dog(name, breed) наследует Animal:
//    - вызывает Animal для инициализации name;
//    - наследует методы через Object.create(Animal.prototype);
//    - восстанавливает Dog.prototype.constructor;
//    - переопределяет speak() — "<name> лает" — и добавляет метод getBreed().

function Animal(name) {
  // Решение тут
}

function Dog(name, breed) {
  // Решение тут
}

// Решение тут: настройте прототипы

// Пример вызова:
const dog = new Dog("Шарик", "дворняга");
console.log(dog.speak()); // "Шарик лает"
console.log(dog.getBreed()); // "дворняга"
console.log(Animal.prototype.speak.call(dog)); // "Шарик издаёт звук"
console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true
console.log(dog.constructor === Dog); // true
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype); // true
console.log(Object.hasOwn(dog, "speak")); // false — метод живёт в прототипе
