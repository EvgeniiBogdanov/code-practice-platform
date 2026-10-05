import React, { useState, useEffect } from 'react';

const POSTS_LIMIT = 5;

export const PostsManager = ({ url }) => {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    // Отмена устаревшего запроса при смене url и размонтировании
    const controller = new AbortController();

    const loadPosts = async () => {
      setStatus('loading');
      setError(null);
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setPosts(data.slice(0, POSTS_LIMIT));
        setStatus('success');
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setStatus('error');
      }
    };

    loadPosts();
    return () => controller.abort();
  }, [url]);

  const addPost = (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    // Локальный пост — в начало списка, с отдельным id и пометкой
    setPosts((prev) => [{ id: crypto.randomUUID(), title, isLocal: true }, ...prev]);
    setNewTitle('');
  };

  const deletePost = (id) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <div>
      <h2>Управление постами</h2>

      <form onSubmit={addPost}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Новый заголовок"
        />
        <button type="submit">Добавить</button>
      </form>

      {status === 'loading' && <p>Загрузка постов...</p>}
      {status === 'error' && <p>Ошибка: {error}</p>}
      {status === 'success' &&
        (posts.length === 0 ? (
          <p>Список пуст</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                {post.title}
                {post.isLocal && ' (локальный)'}{' '}
                <button onClick={() => deletePost(post.id)}>Удалить</button>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
};

export default function App() {
  return <PostsManager url="https://jsonplaceholder.typicode.com/posts" />;
}
