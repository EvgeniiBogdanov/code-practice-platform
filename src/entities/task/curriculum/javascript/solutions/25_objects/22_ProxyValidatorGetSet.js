const createValidatedSchema = (target, schema = {}) => {
  if (target === null || typeof target !== "object") {
    throw new TypeError("Target must be a non-null object");
  }

  return new Proxy(target, {
    get(obj, prop, receiver) {
      if (typeof prop === "symbol" || prop in obj) {
        return Reflect.get(obj, prop, receiver);
      }
      throw new ReferenceError(`Property "${String(prop)}" does not exist on schema`);
    },

    set(obj, prop, value, receiver) {
      const validator = schema[prop];
      if (typeof validator === "function" && !validator(value)) {
        throw new TypeError(`Invalid value for property "${String(prop)}"`);
      }
      return Reflect.set(obj, prop, value, receiver);
    },
  });
};

// Пример вызова:
const userSchema = {
  age: (val) => typeof val === "number" && val > 0,
  name: (val) => typeof val === "string" && val.trim().length > 0,
};

const user = createValidatedSchema({ name: "Анна", age: 25 }, userSchema);

console.log(user.name); // 'Анна'
console.log(user.age); // 25

user.age = 26;
console.log(user.age); // 26

try {
  user.age = -5;
} catch (e) {
  console.log(e.name); // 'TypeError'
}

try {
  console.log(user.unknownProp);
} catch (e) {
  console.log(e.name); // 'ReferenceError'
}
