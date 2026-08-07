/* Что проверяет: Умение оптимизировать количество обращений к API при работе с текстовыми полями, 
используя задержку (debounce) и кастомный хук useDebounce. */

/* В чем подвох: Пользователь вводит слово "Привет" (6 символов). Вместо одного запроса на поиск слова целиком, 
компонент отправляет 6 запросов подряд: "П", "Пр", "При" и т.д. Это перегружает сервер и вызывает баги на клиенте.
 */

import React, { useState, useEffect } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // ❌ ОШИБКА: Запрос летит при каждом нажатии клавиши моментально без задержки (debounce)
  useEffect(() => {
    if (query === '') return;

    const fetchSearchResults = async () => {
      try {
        const res = await fetch(`https://api.example.com/search?q=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div>
      <input 
        type="text" 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        placeholder="Поиск..."
      />
      <ul>
        {results.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  );
}
