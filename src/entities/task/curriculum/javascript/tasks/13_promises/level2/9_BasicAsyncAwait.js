// Напишите асинхронную функцию loadUser(), которая получает пользователя через getUser()
// с использованием async/await и возвращает приветствие `Привет, ${user.name}`.

const getUser = () => Promise.resolve({ id: 1, name: "Maria" });

async function loadUser() {
  // Решение тут
}

// Пример вызова:
loadUser().then(console.log);
