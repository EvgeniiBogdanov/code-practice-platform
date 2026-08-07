import React, { useState, useEffect } from 'react';

// Данная задача на чистом JSX
// Переделай ее в TSX, используя TypeScript

export const PostsManager = ({ url }) => {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    let active = true;

    const loadPosts = async () => {
      try {
        setStatus('loading');
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        const data = await response.json();
        if (active) {
          setPosts(data.slice(0, 5));
          setStatus('success');
        }
      } catch (err) {
        if (active) {
          setStatus('error');
          setError(err.message || 'Не удалось загрузить посты');
        }
      }
    };

    loadPosts();

    return () => {
      active = false;
    };
  }, [url]);

  const deletePost = (id) => {
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  const addPost = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPost = {
      id: Date.now(),
      title: newTitle.trim(),
      isLocal: true,
    };

    setPosts(prev => [newPost, ...prev]);
    setNewTitle('');
  };

  return (
    <div>
      <h2>Управление постами</h2>

      <form onSubmit={addPost}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Новый заголовок"
        />
        <button type="submit">Добавить</button>
      </form>

      <hr />

      {status === 'loading' && <p>Загрузка постов...</p>}
      {status === 'error' && <p>Ошибка: {error}</p>}

      {status === 'success' && (
        <>
          {!posts.length && <p>Список пуст</p>}
          <ul>
            {!!posts.length && posts.map((post) => (
              <li key={post.id} style={{ marginBottom: '6px' }}>
                {post.title}
                {post.isLocal && ' (локальный)'}
                {' '}
                <button onClick={() => deletePost(post.id)}>Удалить</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default function App() {
  return <PostsManager url="https://jsonplaceholder.typicode.com/posts" />;
}
