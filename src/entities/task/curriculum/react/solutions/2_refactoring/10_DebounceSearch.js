import React, { useState, useEffect } from 'react';

//  Хук откладывает обновление значения, пока пользователь продолжает печатать
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delay);
    // Каждое новое нажатие отменяет предыдущий таймер
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

export default function Search() {
  //  Инпут обновляется мгновенно, задержка применяется только к запросу
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query.trim(), 500);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    //  Debounce уменьшает число запросов, но не защищает от гонки ответов
    const controller = new AbortController();

    const search = async () => {
      try {
        setError(null);
        const response = await fetch(
          //  Пользовательский ввод всегда экранируем
          `https://api.example.com/search?q=${encodeURIComponent(debouncedQuery)}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setResults(await response.json());
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      }
    };

    search();
    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск..."
      />
      {error && <p role="alert">Ошибка: {error}</p>}
      <ul>
        {results.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
