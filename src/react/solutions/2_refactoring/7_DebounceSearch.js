import React, { useState, useEffect } from 'react';

//  Кастомный хук useDebounce для откладывания изменения значения
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  //  ПРАВИЛЬНО: Применяем кастомный хук useDebounce
  const debouncedQuery = useDebounce(query, 500);

  //  ПРАВИЛЬНО: Запрос через async/await с обработкой try/catch
  useEffect(() => {
    if (debouncedQuery === '') {
      setResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`https://api.example.com/search?q=${debouncedQuery}`);
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Ошибка при запросе:', error);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery]);

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

/*
=== Разбор решения ===
Использование кастомного хука `useDebounce` с современным синтаксисом `async/await` — это стандарты профессиональной разработки на React.

Преимущества подхода (async/await + useDebounce):
1. **Линейный и чистый код (async/await)**: Код читается синхронно без вложенных цепочек `.then().then()`.
2. **Обработка ошибок (try/catch)**: Перехватывает как сетевые сбои, так и ошибки формата JSON или ответов сервера (!response.ok).
3. **Разделение ответственности**: Логика задержки вынесена в чистый хук `useDebounce(value, delay)`, а компонент лишь делает асинхронную загрузку отложенного значение.
*/
