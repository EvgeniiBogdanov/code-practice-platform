import React, { useState } from 'react';
import { createPortal } from 'react-dom'; //  ПРАВИЛЬНО: Импортируем createPortal

export default function FeedPost({ post }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="post-container">
      <h3>{post?.title || 'Заголовок поста'}</h3>
      <p>{post?.content || 'Текст поста'}</p>
      <button onClick={() => setIsModalOpen(true)}>Поделиться</button>

      {/*  ПРАВИЛЬНО: Телепортируем верстку модалки в document.body */}
      {isModalOpen && createPortal(
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Ссылка скопирована!</p>
            <button onClick={() => setIsModalOpen(false)}>Закрыть</button>
          </div>
        </div>,
        document.body // Указываем DOM-узел, куда вставить HTML
      )}
    </div>
  );
}
