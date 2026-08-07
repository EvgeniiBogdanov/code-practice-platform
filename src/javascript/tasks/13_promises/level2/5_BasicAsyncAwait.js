// Перепишите функцию loadUser с использованием async/await
// вместо .then()

const getUser = () => Promise.resolve({ id: 1, name: "Maria" });

function loadUser() {
  return getUser().then((user) => `Привет, ${user.name}`);
}
