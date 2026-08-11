const deepFreeze = (obj) => {
  Object.freeze(obj);

  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== null && typeof val === "object" && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  }

  return obj;
};

// Пример вызова:
const user = { profile: { name: "Ivan" } };
deepFreeze(user);
console.log(Object.isFrozen(user.profile)); // true
