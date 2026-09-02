const myNew = (Constructor, ...args) => {
  if (typeof Constructor !== "function") {
    throw new TypeError("Constructor must be a function");
  }

  // 1 & 2. Создаем объект с прототипом Constructor.prototype
  const proto =
    Constructor.prototype !== null && typeof Constructor.prototype === "object"
      ? Constructor.prototype
      : Object.prototype;
  const instance = Object.create(proto);

  // 3. Вызываем конструктор в контексте созданного инстанса
  const result = Constructor.apply(instance, args);

  // 4. Если конструктор вернул объект (и не null) или функцию — возвращаем его
  if ((typeof result === "object" && result !== null) || typeof result === "function") {
    return result;
  }

  return instance;
};

// Пример вызова:
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.sayHi = function () {
  return `Привет, я ${this.name}`;
};

const user = myNew(Person, "Дмитрий", 30);
console.log(user.name); // 'Дмитрий'
console.log(user.sayHi()); // 'Привет, я Дмитрий'
console.log(user instanceof Person); // true

function SpecialService() {
  this.type = "standard";
  return { type: "custom_override" };
}
const service = myNew(SpecialService);
console.log(service.type); // 'custom_override'
