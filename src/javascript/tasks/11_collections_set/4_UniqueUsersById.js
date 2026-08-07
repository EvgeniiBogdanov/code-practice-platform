// Есть массив пользователей с возможными дубликатами по id.
// Напишите функцию getUniqueUsers(users), которая оставляет только
// пользователей с уникальным id, сохраняя первое вхождение.

const users = [
  { id: 1, name: 'Ann' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Ann 2' },
  { id: 3, name: 'Kate' },
];

const getUniqueUsers = (arr) => {
  // Решение тут
};

console.log(getUniqueUsers(users));
