// Проведите рефакторинг: кнопка «Очистить» стирает текст только визуально —
// счётчик символов не обнуляется, а состояние SearchField расходится с тем, что видно в поле.
// Исправьте баг и приведите работу с ref к идиоматичному стилю React 19.

import React, { forwardRef, useRef, useState } from 'react';

const SearchField = forwardRef((props, ref) => {
  const [query, setQuery] = useState('');

  return (
    <div>
      <input
        ref={ref}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={props.placeholder}
      />
      <span>Символов: {query.length}</span>
    </div>
  );
});

export default function SearchPanel() {
  const searchRef = useRef(null);

  const handleClear = () => {
    searchRef.current.value = '';
    searchRef.current.focus();
  };

  return (
    <div>
      <SearchField ref={searchRef} placeholder="Поиск..." />
      <button onClick={handleClear}>Очистить</button>
    </div>
  );
}
