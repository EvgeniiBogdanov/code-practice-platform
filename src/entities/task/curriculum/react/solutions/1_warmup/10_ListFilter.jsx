import { useState } from 'react';

const USERS = [
  { id: 1, name: 'Алексей' },
  { id: 2, name: 'Иван' },
  { id: 3, name: 'Ольга' },
  { id: 4, name: 'Мария' },
  { id: 5, name: 'Сергей' },
  { id: 6, name: 'Елена' },
  { id: 7, name: 'Дмитрий' },
];

const ListFilter = () => {
  // Единственный источник правды — строка поиска. Отфильтрованный список не храним в state
  const [query, setQuery] = useState('');

  // Нормализуем запрос один раз, а не на каждой итерации filter
  const normalizedQuery = query.trim().toLowerCase();
  const filteredUsers = USERS.filter((user) => user.name.toLowerCase().includes(normalizedQuery));

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск пользователя..."
      />
      {filteredUsers.length > 0 ? (
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      ) : (
        <p>Никого не нашли</p>
      )}
    </div>
  );
};

export default ListFilter;
