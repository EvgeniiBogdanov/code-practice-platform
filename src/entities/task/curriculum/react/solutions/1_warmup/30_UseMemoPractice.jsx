import { useState, useMemo } from "react";

const USERS = Array.from({ length: 10000 }, (_, i) => `Пользователь ${i}`);

const FilteredList = () => {
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('light'); 

  // Фильтрация 10 000 строк пересчитывается только при смене query.
  // Клик по теме вызывает рендер, но берёт результат из кеша
  const filteredUsers = useMemo(
    () => USERS.filter((user) => user.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <div>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Тема: {theme}
      </button>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {filteredUsers.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default FilteredList;
