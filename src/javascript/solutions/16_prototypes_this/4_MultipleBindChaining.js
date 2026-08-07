let obj1 = {
  name: "User 1",
  getName() {
    console.log(`name is: ${this.name}`);
  },
};

let obj2 = {
  name: "User 2",
  getName() {
    console.log(`name is: ${this.name}`);
  },
};

let fn = obj1.getName.bind(obj2).bind(obj1);

fn(); // "name is: User 2"

// Пояснение: первый bind(obj2) возвращает жестко связанную функцию.
// Повторные вызовы .bind() уже не изменяют зафиксированный this.
