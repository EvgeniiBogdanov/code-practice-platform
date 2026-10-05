import { memo, useCallback, useEffect, useState } from 'react';

type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

type PostItemProps = {
  post: Post;
  onSelect: (id: number) => void;
  isSelected: boolean;
};

// 1. Одна кнопка выбора, текст поста — обычный текст, а не вторая кнопка с тем же действием
const PostItem = memo(({ post, onSelect, isSelected }: PostItemProps) => (
  <li className={isSelected ? 'selected' : undefined}>
    <button type="button" onClick={() => onSelect(post.id)} aria-pressed={isSelected}>
      {post.title}
    </button>
    <p>{post.body}</p>
  </li>
));
PostItem.displayName = 'PostItem';

type Status = 'loading' | 'success' | 'error';

type Props = {
  userId: number;
};

export const UserPostsList = ({ userId }: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState('');

  // 2. Загрузка: проверка res.ok, обработка ошибок и отмена устаревшего запроса
  useEffect(() => {
    const controller = new AbortController();

    const loadPosts = async () => {
      setStatus('loading');
      setError(null);
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${userId}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setPosts(await response.json());
        setStatus('success');
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        setStatus('error');
      }
    };

    loadPosts();
    // Смена userId или размонтирование отменяют запрос — ответ «чужого» пользователя не попадёт в state
    return () => controller.abort();
  }, [userId]);

  // 3. Логирование раз в 3 секунды: интервал очищается при каждом перезапуске эффекта
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(`Active posts for user ${userId}: ${posts.length}`);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [userId, posts.length]);

  // 4. Стабильная ссылка — иначе memo у PostItem бесполезен
  const handleSelect = useCallback((id: number) => setSelectedId(id), []);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p role="alert">Error: {error}</p>;

  // 5. Сначала фильтруем (filter уже возвращает новый массив), затем сортируем эту копию —
  //    state не мутируется. В ES2023 то же самое делает posts.toSorted(...)
  const normalizedFilter = filter.trim().toLowerCase();
  const visiblePosts = posts
    .filter((post) => post.title.toLowerCase().includes(normalizedFilter))
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div>
      <input
        type="search"
        placeholder="Filter by title"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />

      {visiblePosts.length > 0 ? (
        <ul>
          {visiblePosts.map((post) => (
            // 6. Ключ — id из данных, а не индекс
            <PostItem
              key={post.id}
              post={post}
              onSelect={handleSelect}
              isSelected={selectedId === post.id}
            />
          ))}
        </ul>
      ) : (
        <p>No posts found</p>
      )}
    </div>
  );
};

const App = () => <UserPostsList userId={1} />;

export default App;
