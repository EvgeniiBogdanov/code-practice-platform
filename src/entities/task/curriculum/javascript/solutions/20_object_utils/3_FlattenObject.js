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

// Пример вызова:
const nested = { a: { b: { c: 1 } }, d: 2 };
console.log(flattenObject(nested)); // { "a.b.c": 1, "d": 2 }
