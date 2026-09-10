// Что выведет данный код в консоль и почему?

const user = {
  name: "Анна",
  regularMethod() {
    return this.name;
  },
  arrowMethod: () => {
    return this.name;
  },
};

console.log(user.regularMethod());
console.log(user.arrowMethod());
