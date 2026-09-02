const normalizeUser = (rawUser = {}) => {
  const {
    id,
    name,
    email: userEmail = "no-email@example.com",
    role = "guest",
    ...extra
  } = rawUser || {};

  return {
    id,
    name,
    userEmail,
    role,
    extra,
  };
};

// Пример вызова:
const user1 = {
  id: 1,
  name: "Bob",
  email: "bob@test.com",
  role: "admin",
  city: "London",
  hobby: "chess",
};

console.log(normalizeUser(user1));
// {
//   id: 1,
//   name: 'Bob',
//   userEmail: 'bob@test.com',
//   role: 'admin',
//   extra: { city: 'London', hobby: 'chess' }
// }

const user2 = {
  id: 2,
  name: "Anonymous",
};

console.log(normalizeUser(user2));
// {
//   id: 2,
//   name: 'Anonymous',
//   userEmail: 'no-email@example.com',
//   role: 'guest',
//   extra: {}
// }
