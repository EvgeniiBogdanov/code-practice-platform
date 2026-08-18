import React, { useState } from 'react';

//  РЕШЕНИЕ:
// Строго типизируем каждое событие из пакета React
export function EventForm() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');

  // 1. Изменение текстового поля - React.ChangeEvent<HTMLInputElement>
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  // 2. Выбор файла - React.ChangeEvent<HTMLInputElement>
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
    }
  };

  // 3. Нажатие клавиши - React.KeyboardEvent<HTMLInputElement>
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed:', text);
    }
  };

  // 4. Отправка формы - React.FormEvent<HTMLFormElement>
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Отправлено: ${text}, файл: ${fileName}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
      <input 
        type="text" 
        value={text} 
        onChange={handleInputChange} 
        onKeyDown={handleKeyDown}
        placeholder="Введите текст и нажмите Enter" 
      />
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Отправить</button>
      {fileName && <p>Выбран файл: {fileName}</p>}
    </form>
  );
}

export default EventForm;
