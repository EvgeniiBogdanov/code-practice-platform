import React, { useState, useMemo } from 'react';

export const DEFAULT_ITEMS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'Next.js',
  'GraphQL',
  'Tailwind CSS',
  'PostgreSQL',
];

export default function AutocompleteCombobox({ items = DEFAULT_ITEMS, onSelect }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return items.filter((item) => item.toLowerCase().includes(trimmed));
  }, [items, query]);

  const handleSelect = (item) => {
    setQuery(item);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSelect?.(item);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(Boolean(value.trim()));
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || filteredItems.length === 0) {
      if (e.key === 'ArrowDown' && query.trim()) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
        handleSelect(filteredItems[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleBlur = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <div>
      <h3>Поиск технологии</h3>
      <div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Начните ввод (например, React)..."
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="autocomplete-listbox"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              setHighlightedIndex(-1);
            }}
          >
            Очистить
          </button>
        )}
      </div>

      {isOpen && (
        <ul id="autocomplete-listbox" role="listbox">
          {filteredItems.length === 0 ? (
            <li role="option" aria-selected="false">
              Ничего не найдено
            </li>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === highlightedIndex;
              return (
                <li
                  key={item}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => {
                    // Предотвращает blur на инпуте до срабатывания выбора
                    e.preventDefault();
                    handleSelect(item);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {isSelected ? `👉 ${item}` : item}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
