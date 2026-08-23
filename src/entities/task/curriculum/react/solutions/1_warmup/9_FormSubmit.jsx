import { useState } from 'react';

const FormSubmit = () => {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedQuery(query);
    setQuery('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поисковый запрос..."
        />
        <button type="submit">Искать</button>
      </form>
      {submittedQuery && <p>Отправленный запрос: {submittedQuery}</p>}
    </div>
  );
};

export default FormSubmit;
