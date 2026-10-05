import { useState, useEffect } from 'react';

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

const fetchUsers = async (signal) => {
  const response = await fetch(USERS_URL, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

const UsersListWithAbort = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Свой контроллер на каждый запуск эффекта
    const controller = new AbortController();

    const loadUsers = async () => {
      try {
        const data = await fetchUsers(controller.signal);
        setUsers(data);
        setStatus('success');
      } catch (err) {
        // Отмена — штатная ситуация, а не ошибка для пользователя.
        // Проверяем сам signal, а не err.name: имя теряется, если ошибку где-то переобернули,
        // и не совпадает, если abort() вызвали с собственной причиной
        if (controller.signal.aborted) return;
        setError(err.message);
        setStatus('error');
      }
    };

    loadUsers();

    // Размонтирование (и повторный запуск эффекта в StrictMode) отменяет запрос
    return () => controller.abort();
  }, []);

  if (status === 'loading') return <p>Загрузка...</p>;
  if (status === 'error') return <p>Ошибка: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export default UsersListWithAbort;
