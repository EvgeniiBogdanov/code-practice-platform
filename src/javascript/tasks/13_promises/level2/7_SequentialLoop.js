// Дан массив id пользователей и функция fetchUser(id).
// Загрузите пользователей ПОСЛЕДОВАТЕЛЬНО (один за другим)
// и выведите массив имён.

const ids = [1, 2, 3];
const fetchUser = (id) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ id, name: `User${id}` }), 300)
  );

async function loadAllSequentially() {
  // Решение тут
}

// Пример вызова:
loadAllSequentially().then(console.log);
