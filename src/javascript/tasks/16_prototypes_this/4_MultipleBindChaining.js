// Что будет выведено

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

fn();
