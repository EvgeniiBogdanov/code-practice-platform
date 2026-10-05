const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

// Функция запроса не ловит ошибки «на всякий случай»: она их пробрасывает,
// а что показать пользователю, решает вызывающий код
const fetchUsers = async () => {
  const response = await fetch(USERS_URL);

  // fetch не отклоняет промис на 404 и 500 — проверяем статус вручную
  if (!response.ok) {
    throw new Error(`Не удалось загрузить пользователей: HTTP ${response.status}`);
  }

  return response.json();
};

// Использование:
// try {
//   const users = await fetchUsers();
// } catch (error) {
//   console.error(error.message);
// }
