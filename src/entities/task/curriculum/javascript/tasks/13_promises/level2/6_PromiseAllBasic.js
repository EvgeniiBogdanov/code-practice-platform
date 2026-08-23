// Параллельное выполнение через Promise.all
// Напишите функцию fetchAllUsers(ids), которая параллельно загружает данные для каждого id через getUserById(id).

const getUserById = (id) =>
  new Promise((r) => setTimeout(() => r({ id, name: `User ${id}` }), 100));

const fetchAllUsers = (ids) => {
  // Решение тут
};

// Пример вызова:
fetchAllUsers([1, 2, 3]).then(console.log); // [{ id: 1, name: "User 1" }, { id: 2, name: "User 2" }, { id: 3, name: "User 3" }]
