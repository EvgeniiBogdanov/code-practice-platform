const pick = (obj, keys = []) => {
  if (!obj || typeof obj !== "object" || !Array.isArray(keys)) {
    return {};
  }

  const result = {};
  for (const key of keys) {
    if (Object.hasOwn(obj, key)) {
      result[key] = obj[key];
    }
  }

  return result;
};

// Пример вызова:
const user = {
  id: 1,
  name: "John",
  email: "john@example.com",
  age: 30,
  role: "admin",
};

console.log(pick(user, ["name", "email"]));
// { name: 'John', email: 'john@example.com' }

console.log(pick(user, ["id", "unknownKey", "role"]));
// { id: 1, role: 'admin' }

console.log(pick(user, []));
// {}
