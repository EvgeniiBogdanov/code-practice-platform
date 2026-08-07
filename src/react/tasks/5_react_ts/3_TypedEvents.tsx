import React, { useState } from 'react';

// ❌ ОШИБКА / ЗАДАЧА:
// Все обработчики событий используются с типом any или не типизированы.
// При попытке прочитать e.target.files или e.key происходят ошибки типезирования.

export function EventForm() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');

  // ❌ any скрывает отсутствие проверки свойств у target
  const handleInputChange = (e: any) => {
    setText(e.target.value);
  };

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed:', text);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert(`Отправлено: ${text}, файл: ${fileName}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={text} 
        onChange={handleInputChange} 
        onKeyDown={handleKeyDown} 
      />
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Отправить</button>
    </form>
  );
}

export default EventForm;
