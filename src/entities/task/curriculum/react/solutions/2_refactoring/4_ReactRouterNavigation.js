import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export function Sidebar() {
  return (
    <nav>
      <ul>
        {/*  ПРАВИЛЬНО: Link меняет URL через History API без перезагрузки страницы */}
        <li><Link to="/">Лента</Link></li>
        <li><Link to="/messages">Сообщения</Link></li>
        <li><Link to="/profile/me">Мой профиль</Link></li>
      </ul>
    </nav>
  );
}

export function CreatePost() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/posts', { method: 'POST', body: title });
    const newPost = await response.json();

    //  ПРАВИЛЬНО: программный SPA-переход без перезагрузки
    navigate(`/post/${newPost.id}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button type="submit">Создать</button>
    </form>
  );
}

//  ПРАВИЛЬНО: параметр берётся из описания роута /post/:id, а не из ручного парсинга URL
export function PostPage() {
  const { id } = useParams();

  return <div>Страница поста ID: {id}</div>;
}
