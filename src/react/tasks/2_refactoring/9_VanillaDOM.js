/* Что проверяет: Умение правильно взаимодействовать с DOM-узлами (например, для установки фокуса, 
прокрутки или измерения размеров), не используя методы document.querySelector или document.getElementById.
 */

/* В чем подвох: Разработчик хочет автоматически сфокусировать поле ввода комментария, когда пользователь нажимает 
кнопку "Ответить". Он использует классические методы браузера, что нарушает парадигму React.
 */

import React, { useState } from 'react';

export default function PulsoreCommentBox() {
  const [comment, setComment] = useState('');

  const handleReplyClick = () => {
    const inputElement = document.getElementById('comment-input');
    if (inputElement) {
      inputElement.focus();
    }
  };

  return (
    <div className="comment-box">
      <button onClick={handleReplyClick}>Ответить</button>
      <input 
        id="comment-input"
        type="text" 
        value={comment} 
        onChange={(e) => setComment(e.target.value)} 
        placeholder="Напишите ответ..."
      />
    </div>
  );
}