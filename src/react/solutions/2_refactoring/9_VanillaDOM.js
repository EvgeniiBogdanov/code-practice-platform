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
