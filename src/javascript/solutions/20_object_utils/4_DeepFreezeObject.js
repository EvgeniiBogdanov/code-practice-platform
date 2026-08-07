// Заморозка объектов - Deep Freeze

const deepFreeze = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  Object.freeze(obj);

  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = obj[prop];
    if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });

  return obj;
};

const user = {
  name: "Alex",
  info: {
    age: 30,
    hobbies: ["reading", "coding"],
  },
};

deepFreeze(user);

try {
  user.name = "Bob";
  user.info.age = 35;
} catch (e) {
  // Игнорируем ошибки при попытке записи в замороженный объект
}

console.log(user.name); // "Alex"
console.log(user.info.age); // 30
console.log(Object.isFrozen(user.info)); // true
console.log(Object.isFrozen(user.info.hobbies)); // true
