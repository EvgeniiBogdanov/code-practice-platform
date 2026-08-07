import React, { useState, useRef } from 'react';

export default function PulsoreCommentBox() {
  const [comment, setComment] = useState('');
  //  ПРАВИЛЬНО: Создаем реф
  const inputRef = useRef(null);

  const handleReplyClick = () => {
    //  ПРАВИЛЬНО: Обращаемся к элементу через свойство current
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="comment-box">
      <button onClick={handleReplyClick}>Ответить</button>
      <input 
        //  ПРАВИЛЬНО: Привязываем реф к конкретному DOM-узлу
        ref={inputRef}
        type="text" 
        value={comment} 
        onChange={(e) => setComment(e.target.value)} 
        placeholder="Напишите ответ..."
      />
    </div>
  );
}

/*
=== Разбор решения ===
Использование document.getElementById делает компонент непереиспользуемым. Если на странице будет два компонента PulsoreCommentBox (например, под двумя разными постами), у них будет одинаковый id, и фокус сработает некорректно (всегда будет фокусироваться первый найденный). Нужно привязать элемент к useRef.
*/
