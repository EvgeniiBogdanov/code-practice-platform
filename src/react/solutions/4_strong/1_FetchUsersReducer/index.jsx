import React from 'react';
import { useFetchUsers } from './useFetchUsers';

const FetchUsersReducer = () => {
  const { users, loading, error } = useFetchUsers();

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h2>Список пользователей (useReducer)</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FetchUsersReducer;
