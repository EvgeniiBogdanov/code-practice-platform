// Загрузите данные пользователей последовательно (один за другим) в цикле for...of с использованием await.
// Функция loadAllSequentially() должна вернуть массив имён ["User1", "User2", "User3"].

const ids = [1, 2, 3];
const fetchUser = (id) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ id, name: `User${id}` }), 300)
  );

async function loadAllSequentially() {
  // Решение тут
}

// Пример вызова:
loadAllSequentially().then(console.log); // ["User1", "User2", "User3"]
