const flattenObject = (obj, prefix = "") => {
  if (obj === null || typeof obj !== "object") {
    return prefix ? { [prefix]: obj } : {};
  }

  const result = {};
  const keys = Object.keys(obj);

  // Если объект или массив пустой ({}, []) — сохраняем его как значение
  if (keys.length === 0 && prefix) {
    result[prefix] = obj;
    return result;
  }

  for (const key of keys) {
    const val = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (
      val !== null &&
      typeof val === "object" &&
      Object.keys(val).length > 0
    ) {
      Object.assign(result, flattenObject(val, newKey));
    } else {
      result[newKey] = val;
    }
  }

  return result;
};

// Пример вызова:
const nested = {
  user: {
    name: "Alice",
    address: {
      city: "Paris",
      zip: 75001,
    },
  },
  roles: ["admin", "editor"],
  flags: {},
};

console.log(flattenObject(nested));
// {
//   'user.name': 'Alice',
//   'user.address.city': 'Paris',
//   'user.address.zip': 75001,
//   'roles.0': 'admin',
//   'roles.1': 'editor',
//   'flags': {}
// }

console.log(flattenObject({ a: 1, b: { c: 2 } }));
// { 'a': 1, 'b.c': 2 }
