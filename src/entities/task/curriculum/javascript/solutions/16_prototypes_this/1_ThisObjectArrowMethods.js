const user = {
  name: "Анна",
  regularMethod() {
    return this.name;
  },
  arrowMethod: () => {
    return this.name;
  },
};

console.log(user.regularMethod()); // "Анна"
console.log(user.arrowMethod());   // undefined
