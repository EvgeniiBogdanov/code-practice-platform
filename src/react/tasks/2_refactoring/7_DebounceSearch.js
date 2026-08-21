// Проведите рефакторинг компонента Search: оптимизируйте отправку поисковых запросов при вводе текста.

import React, { useState, useEffect } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

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