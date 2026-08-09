/* Что проверяет: Понимание разницы между деревом компонентов React и реальным DOM-деревом браузера. 
Умение решать проблемы с overflow: hidden и конфликтами z-index. */

/* В чем подвох: Вы создали компонент поста в ленте. При клике на кнопку "Поделиться" должно открываться модальное окно. 
Но контейнер ленты имеет стиль overflow: hidden (или сложный z-index). 
В результате модальное окно обрезается границами поста и выглядит сломанным. */

import React, { useState } from 'react';

export default function FeedPost({ post }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    // Представим, что у .post-container в CSS задан overflow: hidden
    <div className="post-container">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <button onClick={() => setIsModalOpen(true)}>Поделиться</button>

      {/* ❌ ОШИБКА: Модалка рендерится внутри контейнера с жесткими CSS-ограничениями */}
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