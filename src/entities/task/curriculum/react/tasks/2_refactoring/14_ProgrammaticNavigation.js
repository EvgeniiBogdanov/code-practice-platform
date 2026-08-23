// Проведите рефакторинг компонентов CreatePost и PostPage: избавьтесь от прямого обращения к объекту window для навигации и чтения параметров.

import React, { useState } from 'react';

export default function CreatePost() {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/posts', { method: 'POST', body: title });
    const newPost = await response.json();

    window.location.href = `/post/${newPost.id}`; 
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button type="submit">Создать</button>
    </form>
  );
}

// Компонент страницы поста
export function PostPage() {
  const postId = window.location.pathname.split('/').pop(); 

  return <div>Страница поста ID: {postId}</div>;
}