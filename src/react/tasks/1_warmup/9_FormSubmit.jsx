import { useState } from 'react';

// Задача:
// 1. При отправке формы или нажатии Enter в инпуте происходит перезагрузка страницы браузера,
//    и введенный текст теряется.
// 2. Исправьте код так, чтобы отправка формы обрабатывалась без перезагрузки страницы.
// 3. Сохраните значение query в submittedQuery и очистите инпут при отправке.

const FormSubmit = () => {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const handleSearch = () => {
    setSubmittedQuery(query);
    setQuery('');
  };

  return (
    <div>
      {/* 
        Проблема: При нажатии на кнопку отправки или Enter происходит перезагрузка страницы.
        Исправьте код, чтобы страница не перезагружалась при отправке.
      */}
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