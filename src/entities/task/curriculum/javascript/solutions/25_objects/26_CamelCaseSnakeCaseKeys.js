const snakeToCamel = (str) =>
  str.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());

const camelToSnake = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const isPlainObject = (obj) => {
  if (obj === null || typeof obj !== "object") return false;
  if (Array.isArray(obj)) return false;
  const proto = Object.getPrototypeOf(obj);
  return proto === Object.prototype || proto === null;
};

const transformKeys = (data, keyTransformer) => {
  if (data === null || typeof data !== "object") {
    return data;
  }

  if (data instanceof Date || data instanceof RegExp) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => transformKeys(item, keyTransformer));
  }

  if (isPlainObject(data)) {
    const result = {};
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const newKey = keyTransformer(key);
      result[newKey] = transformKeys(data[key], keyTransformer);
    }
    return result;
  }

  return data;
};

const keysToCamelCase = (data) => transformKeys(data, snakeToCamel);
const keysToSnakeCase = (data) => transformKeys(data, camelToSnake);

// Пример вызова:
const apiResponse = {
  user_id: 42,
  user_info: {
    first_name: "John",
    last_name: "Doe",
    created_at: new Date("2025-01-01"),
  },
  order_items: [
    { item_id: 1, item_price: 100 },
    { item_id: 2, item_price: 250 },
  ],
};

const camelCased = keysToCamelCase(apiResponse);
console.log(camelCased);
// {
//   userId: 42,
//   userInfo: {
//     firstName: 'John',
//     lastName: 'Doe',
//     createdAt: 2025-01-01T00:00:00.000Z
//   },
//   orderItems: [
//     { itemId: 1, itemPrice: 100 },
//     { itemId: 2, itemPrice: 250 }
//   ]
// }

console.log(keysToSnakeCase(camelCased)); // возвращает обратно в snake_case
