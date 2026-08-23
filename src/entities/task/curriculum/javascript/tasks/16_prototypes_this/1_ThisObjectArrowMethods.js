// Поведение this в стрелочных и обычных методах объекта
// Что выведет следующий код?

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
