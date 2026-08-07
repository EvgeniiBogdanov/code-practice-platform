import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; //  ПРАВИЛЬНО: Импортируем хуки роутера

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate(); //  ПРАВИЛЬНО: Инициализируем функцию навигации

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/posts', { method: 'POST', body: title });
    const newPost = await response.json();

    //  ПРАВИЛЬНО: Мягкий SPA-переход на новую страницу
    navigate(`/post/${newPost.id}`); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button type="submit">Создать</button>
    </form>
  );
}

// Компонент страницы поста (роут настроен как <Route path="/post/:id" element={<PostPage />} />)
export function PostPage() {
  //  ПРАВИЛЬНО: Чисто и надежно достаем параметры через useParams
  const { id } = useParams(); 

  return <div>Страница поста ID: {id}</div>;
}

/*
=== Разбор решения ===
В React Router v6 для перенаправления из кода (например, после fetch-запроса) используется хук useNavigate. А для того, чтобы достать параметры из URL (например, :id из роута /post/:id), используется хук useParams.
*/
