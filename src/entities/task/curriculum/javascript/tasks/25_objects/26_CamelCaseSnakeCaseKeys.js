// Рекурсивное преобразование ключей camelCase / snake_case
// Напишите функции keysToCamelCase(data) и keysToSnakeCase(data), которые:
// 1. Рекурсивно преобразуют ключи всех вложенных plain-объектов и массивов.
// 2. keysToCamelCase переводит ключи из snake_case в camelCase (user_id -> userId).
// 3. keysToSnakeCase переводит ключи из camelCase в snake_case (userId -> user_id).
// 4. Корректно сохраняют без изменений специальные типы данных: Date, RegExp, примитивы.

const keysToCamelCase = (data) => {
  // Решение тут
};

const keysToSnakeCase = (data) => {
  // Решение тут
};

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
