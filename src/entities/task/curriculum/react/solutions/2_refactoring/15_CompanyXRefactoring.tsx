import { memo, useEffect, useState, useCallback, useRef } from 'react';

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

// 1. Исправлен PostItem
const PostItem = memo(({ 
  post, 
  onSelect, 
  isSelected 
}: PostItemProps) => {
  return (
    <li className={isSelected ? 'selected' : ''}>
      <button onClick={() => onSelect(post.id)}>
        {post.title}
      </button>
      {/* Убрал дублирующую кнопку с body */}
    </li>
  );
});

PostItem.displayName = 'PostItem';

type Props = {
  userId: number;
};

export const UserPostsList = ({ userId }: Props) => {
  // 2. Все состояния объявлены корректно
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState('');

  // 3. useRef для interval (чтобы очищать)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 4. Правильный useEffect с async
  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }

        const data: Post[] = await response.json();

        if (isMounted) {
          setPosts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPosts();

    // Очистка при размонтировании или изменении userId
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // 5. Логика фильтрации и сортировки без мутации
  const visiblePosts = posts
    .slice() // Создаём копию, чтобы не мутировать оригинал
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter((post) =>
      post.title.toLowerCase().includes(filter.toLowerCase())
    );

  // 6. useCallback для стабильной ссылки
  const handleSelect = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  // 7. Исправленный setInterval с очисткой
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log(`Active posts for user ${userId}: ${posts.length}`);
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [userId, posts.length]); // Добавил зависимости

  // 8. Обработка состояний загрузки и ошибок
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div>
      <input
        type="search"
        placeholder="Filter by title"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />

      <ul>
        {visiblePosts.map((post) => (
          <PostItem
            key={post.id} //  Используем реальный id, а не index
            post={post}
            onSelect={handleSelect}
            isSelected={selectedId === post.id}
          />
        ))}
      </ul>

      {visiblePosts.length === 0 && !isLoading && (
        <p>No posts found</p>
      )}
    </div>
  );
};

const App = () => {
  return <UserPostsList userId={1} />;
};

export default App;
