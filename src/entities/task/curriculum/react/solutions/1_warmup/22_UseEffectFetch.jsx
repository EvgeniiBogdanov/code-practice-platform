import { useState, useEffect } from 'react';

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

// Функция запроса пробрасывает ошибку, а не глотает её
const fetchUsers = async () => {
  const response = await fetch(USERS_URL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

const UsersList = () => {
  const [users, setUsers] = useState([]);
  // Запрос стартует сразу при монтировании, поэтому начальный статус — loading
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Колбэк эффекта не может быть async: он должен вернуть cleanup или ничего
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
        setStatus('success');
      } catch (err) {
        setError(err.message);
        setStatus('error');
      }
    };

    loadUsers();
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

export default UsersList;
