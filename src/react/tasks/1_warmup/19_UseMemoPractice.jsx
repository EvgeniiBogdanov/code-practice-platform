import { useState, useMemo } from 'react';

// **Найди где нужен useMemo, и примени его**

const USERS = Array.from({ length: 10000 }, (_, i) => `Пользователь ${i}`);

const FilteredList = () => {
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('light'); 

  const filteredUsers = USERS.filter((user) => user.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Тема: {theme}
      </button>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {filteredUsers.map((user, i) => <li key={i}>{user}</li>)}
      </ul>
    </div>
  );
};

export default FilteredList;
