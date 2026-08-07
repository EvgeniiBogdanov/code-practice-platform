import { useState } from 'react';

const SearchInput = () => {
  const [text, setText] = useState('');

  function handleChange(e) {
    // Записываем в состояние текущее значение из поля ввода
    setText(e.target.value);
  }

  return (
    <>
      <input 
        value={text} 
        onChange={handleChange} 
        placeholder="Введите поисковый запрос..." 
      />
      <p>Вы ищете: {text}</p>
      <button onClick={() => setText('')}>
        Очистить
      </button>
    </>
  );
};

export default SearchInput;
