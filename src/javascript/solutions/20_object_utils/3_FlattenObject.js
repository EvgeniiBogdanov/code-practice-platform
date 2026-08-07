// Трансформация объектов - Flatten Object

const flattenObject = (obj, prefix = "") => {
  const result = {};

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
};

const nested = {
  user: {
    name: "John",
    address: {
      city: "Moscow",
      zip: 101000,
    },
  },
  active: true,
};

console.log(flattenObject(nested));
// {
//   'user.name': 'John',
//   'user.address.city': 'Moscow',
//   'user.address.zip': 101000,
//   'active': true
// }
