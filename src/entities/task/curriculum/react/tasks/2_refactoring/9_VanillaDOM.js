// Проведите рефакторинг компонента PulsoreCommentBox: приведите работу с фокусом инпута к идиоматичному для React стилю.

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