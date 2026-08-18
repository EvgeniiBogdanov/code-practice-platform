import React, { useState } from 'react';

/**
 * Собеседование: React + TypeScript
 * 
 * КОНТЕКСТ:
 * Вы проводите код-ревью формы ввода данных и загрузки файлов.
 *
 * ПРОБЛЕМА:
 * Все обработчики событий (`onChange`, `onKeyDown`, `onSubmit`) написаны с типом `any`.
 * Это скрывает ошибки при обращении к свойствам целевого элемента (например, `target.value`, `target.files`, `e.key`)
 * и отключает подсказки типов IDE.
 *
 * ТРЕБОВАНИЯ:
 * 1. Избавьтесь от всех `any` в сигнатурах обработчиков событий.
 * 2. Используйте соответствующие синтетические события React, связав их с конкретными HTML-элементами формы.
 * 3. Обеспечьте строгую типобезопасность при чтении введенного текста, выбранных файлов, нажатой клавиши и предотвращении отправки формы.
 */

export function EventForm() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');

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
