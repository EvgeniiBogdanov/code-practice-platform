import React, { useImperativeHandle, useRef, useState } from 'react';

// ✅ React 19: ref приходит обычным пропсом — forwardRef больше не нужен
const SearchField = ({ placeholder, ref }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // ✅ Наружу отдаём только нужные команды, а не весь DOM-узел.
  // clear() меняет состояние, поэтому value, счётчик и DOM остаются синхронными.
  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => {
        setQuery('');
        inputRef.current?.focus();
      },
    }),
    []
  );

  return (
    <div>
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
      />
      <span>Символов: {query.length}</span>
    </div>
  );
};

export default function SearchPanel() {
  const searchRef = useRef(null);

  return (
    <div>
      <SearchField ref={searchRef} placeholder="Поиск..." />
      <button onClick={() => searchRef.current?.clear()}>Очистить</button>
    </div>
  );
}
