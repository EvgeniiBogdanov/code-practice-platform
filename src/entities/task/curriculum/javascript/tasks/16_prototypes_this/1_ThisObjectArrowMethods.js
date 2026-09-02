// Что выведет данный код в консоль и почему?

const user = {
  name: "Alice",
  regularMethod() {
    console.log("regular:", this.name);
  },
  arrowMethod: () => {
    console.log("arrow:", this.name);
  },
};

user.regularMethod();
user.arrowMethod();
