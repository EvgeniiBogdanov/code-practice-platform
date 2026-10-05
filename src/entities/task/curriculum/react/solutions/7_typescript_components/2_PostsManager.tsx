import React, { useState, useEffect } from 'react';

// Серверные посты имеют числовой id, локальные — строковый UUID
export interface Post {
  id: number | string;
  title: string;
  body?: string;
}

export interface LocalPost extends Post {
  isLocal?: boolean;
}

export interface PostsManagerProps {
  url: string;
}

export type TStatus = 'loading' | 'success' | 'error';

const POSTS_LIMIT = 5;

export const PostsManager = ({ url }: PostsManagerProps) => {
  const [posts, setPosts] = useState<LocalPost[]>([]);
  const [status, setStatus] = useState<TStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadPosts = async (): Promise<void> => {
      setStatus('loading');
      setError(null);
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        // Ответ сети — unknown по сути; аннотация фиксирует ожидаемую форму данных
        const data: Post[] = await response.json();
        setPosts(data.slice(0, POSTS_LIMIT));
        setStatus('success');
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Не удалось загрузить посты');
        setStatus('error');
      }
    };

    loadPosts();
    return () => controller.abort();
  }, [url]);

  const addPost = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    setPosts((prev) => [{ id: crypto.randomUUID(), title, isLocal: true }, ...prev]);
    setNewTitle('');
  };

  const deletePost = (id: LocalPost['id']): void => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <div>
      <h2>Управление постами</h2>

      <form onSubmit={addPost}>
        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Новый заголовок" />
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
