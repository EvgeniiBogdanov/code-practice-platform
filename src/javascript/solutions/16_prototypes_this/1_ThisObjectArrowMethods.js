const object = {
  firstName: "Bill",
  lastName: "Ivanov",

  sayLastName: () => {
    console.log(this.lastName);
  },

  sayName() {
    console.log(this.firstName);
  },
};

object.sayName(); // "Bill"
object.sayLastName(); // undefined

var b = object.sayName;
b(); // undefined (потеря контекста)

object.sayName.bind({ firstName: "Cash" })(); // "Cash"
object.sayLastName.bind({ firstName: "Arrow" })(); // undefined (bind не работает со стрелочной функцией)

object.sayName.bind({ firstName: "Name1" }).bind({ firstName: "Name2" })(); // "Name1" (повторный bind не переопределяет первый)
