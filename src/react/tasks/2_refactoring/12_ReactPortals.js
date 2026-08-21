// Проведите рефакторинг: модальное окно компонента FeedPost обрезается границами родительского контейнера (overflow: hidden). Исправьте проблему с отображением модалки.

import React, { useState } from 'react';

export default function FeedPost({ post }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="post-container">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <button onClick={() => setIsModalOpen(true)}>Поделиться</button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Ссылка скопирована!</p>
            <button onClick={() => setIsModalOpen(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}