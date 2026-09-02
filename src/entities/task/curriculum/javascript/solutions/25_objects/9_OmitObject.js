const omit = (obj, keys = []) => {
  if (!obj || typeof obj !== "object") {
    return {};
  }

  const omitSet = new Set(Array.isArray(keys) ? keys : []);
  const result = {};

  for (const key of Object.keys(obj)) {
    if (!omitSet.has(key)) {
      result[key] = obj[key];
    }
  }

  return result;
};

// Пример вызова:
const user = {
  id: 1,
  name: "Alice",
  passwordHash: "secret_123",
  role: "admin",
  createdAt: "2025-01-01",
};

console.log(omit(user, ["passwordHash", "createdAt"]));
// { id: 1, name: 'Alice', role: 'admin' }

console.log(omit(user, ["unknownKey"]));
// { id: 1, name: 'Alice', passwordHash: 'secret_123', role: 'admin', createdAt: '2025-01-01' }

console.log(omit(user, []));
// { id: 1, name: 'Alice', passwordHash: 'secret_123', role: 'admin', createdAt: '2025-01-01' }
