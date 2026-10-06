import { useState } from 'react';

// Задача:
// Сделайте поисковую форму: пользователь вводит запрос и отправляет его
// кнопкой «Искать» или клавишей Enter в инпуте.
// При отправке страница браузера не должна перезагружаться.
// Введённый запрос нужно сохранить в submittedQuery (он выводится ниже),
// а инпут — очистить.

const FormSubmit = () => {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const handleSearch = () => {
    setSubmittedQuery(query);
    setQuery('');
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поисковый запрос..."
      />
      <button onClick={handleSearch}>Искать</button>

      {submittedQuery && <p>Отправленный запрос: {submittedQuery}</p>}
    </div>
  );
};

export default FormSubmit;
