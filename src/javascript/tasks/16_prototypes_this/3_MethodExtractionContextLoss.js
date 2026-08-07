// Что будет выведено и как это исправить?
let obj = {
  name: "David",
  getName() {
    console.log(`name is: ${this.name}`);
  },
};

let fn = obj.getName;

fn();
