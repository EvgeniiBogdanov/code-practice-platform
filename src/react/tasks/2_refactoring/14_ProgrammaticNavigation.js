/* Что проверяет: Умение работать с хуками React Router (useNavigate и useParams) для программных 
редиректов и извлечения динамических параметров из адресной строки.
*/

/* В чем подвох: Пользователь заполняет форму создания нового поста. После успешной отправки на сервер его 
нужно автоматически перекинуть на страницу этого поста. Разработчик использует старые "дедовские" методы нативного JS.
*/

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
