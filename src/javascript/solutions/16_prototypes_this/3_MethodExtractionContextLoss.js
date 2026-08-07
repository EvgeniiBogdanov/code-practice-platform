// Исходная проблема: при передаче fn = obj.getName теряется контекст this.
// Вывод fn(): "name is: undefined"

// Вариант исправления с bind:
let obj = {
  name: "David",
  getName() {
    console.log(`name is: ${this.name}`);
  },
};

let fn = obj.getName.bind(obj);

fn(); // "name is: David"
