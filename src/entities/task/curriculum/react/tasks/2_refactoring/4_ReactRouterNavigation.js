// Проведите рефакторинг навигации: переходы по ссылкам и после создания поста
// перезагружают страницу и сбрасывают состояние приложения, а PostPage вручную парсит URL.
// Переведите навигацию на React Router.
// Роуты: <Route path="/post/:id" element={<PostPage />} />

import React, { useState } from 'react';

export function Sidebar() {
  return (
    <nav>
      <ul>
        <li><a href="/">Лента</a></li>
        <li><a href="/messages">Сообщения</a></li>
        <li><a href="/profile/me">Мой профиль</a></li>
      </ul>
    </nav>
  );
}

export function CreatePost() {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/posts', { method: 'POST', body: title });
    const newPost = await response.json();

    window.location.href = `/post/${newPost.id}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button type="submit">Создать</button>
    </form>
  );
}

export function PostPage() {
  const postId = window.location.pathname.split('/').pop();

  return <div>Страница поста ID: {postId}</div>;
}
