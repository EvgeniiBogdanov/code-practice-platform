// Рекурсивное преобразование ключей: snake_case в camelCase
// Напишите функцию camelCaseKeys(obj), которая рекурсивно преобразует все ключи вложенного объекта или массива из snake_case в camelCase.

const camelCaseKeys = (obj) => {
  // Решение тут
};

// Пример вызова:
const apiResponse = {
  user_id: 1,
  first_name: "Иван",
  user_contacts: { phone_number: "+79990001122" },
  recent_orders: [{ order_id: 101, is_paid: true }],
};

console.log(camelCaseKeys(apiResponse));
// {
//   userId: 1,
//   firstName: "Иван",
//   userContacts: { phoneNumber: "+79990001122" },
//   recentOrders: [{ orderId: 101, isPaid: true }]
// }
