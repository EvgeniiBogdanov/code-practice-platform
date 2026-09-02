const deepFreeze = (obj) => {
  Object.freeze(obj);

  for (const key of Object.getOwnPropertyNames(obj)) {
    const value = obj[key];

    if (
      value !== null &&
      (typeof value === "object" || typeof value === "function") &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  }

  return obj;
};

// Примеры для проверки:
const user = {
  name: "Ivan",
  profile: {
    age: 30,
    address: { city: "Moscow" },
  },
};

deepFreeze(user);
console.log(Object.isFrozen(user.profile)); // true
console.log(Object.isFrozen(user.profile.address)); // true
