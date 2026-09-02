// Наследование классов, приватные и статические поля
// Реализуйте базовый класс Vehicle(brand) со статическим счетчиком созданных объектов и класс-наследник Car(brand, model) с приватным полем скорости.

class Vehicle {
  // Решение тут
}

class Car extends Vehicle {
  // Решение тут
}

// Пример вызова:
const c1 = new Car("BMW", "M5");
const c2 = new Car("Audi", "RS6");
console.log(Vehicle.getCount()); // 2
console.log(c1.getInfo()); // "BMW M5"
