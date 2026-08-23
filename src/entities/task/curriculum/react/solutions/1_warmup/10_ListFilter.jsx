import { useState } from 'react';

const USERS = [
  { id: 1, name: 'Алексей' },
  { id: 2, name: 'Иван' },
  { id: 3, name: 'Ольга' },
  { id: 4, name: 'Мария' },
  { id: 5, name: 'Сергей' },
  { id: 6, name: 'Елена' },
  { id: 7, name: 'Дмитрий' }
];

const ListFilter = () => {
  const [query, setQuery] = useState('');

  const filteredUsers = USERS.filter((user) => {
    const dataUsers = user.name.toLowerCase();
    const searchUser = query.toLowerCase();
    const result = dataUsers.includes(searchUser);
    
    return result;
  });

  const handleSearchTextChange = (e) => setQuery(e.target.value);

  return (
    <div>
      <input 
        type="text" 
        value={query} 
        onChange={handleSearchTextChange} 
        placeholder="Поиск пользователя..."
      />
      <ul>
        {!!filteredUsers.length && filteredUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListFilter;