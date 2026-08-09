/** Ниже приведён React-компонент (TypeScript), который загружает список постов
 * пользователя, позволяет фильтровать их по названию и выбирать конкретный пост.
 * В коде намеренно допущено несколько ошибок и антипаттернов.
 *
 * Найдите и исправьте следующие проблемы:
 * 1. PostItem рендерит две кнопки с одинаковым действием (дублирование)
 * 2. key у элементов списка использует index вместо реального id
 * 3. useEffect с fetch не обрабатывает размонтирование компонента
 *    (нет проверки isMounted, возможна ошибка "setState on unmounted component")
 * 4. Сортировка постов мутирует исходный массив (используется .sort()
 *    напрямую без копирования через .slice())
 * 5. setInterval создаётся без очистки — при каждом рендере/размонтировании
 *    возникает утечка таймера
 * 6. handleSelect создаётся заново при каждом рендере, что ломает
 *    мемоизацию PostItem (обёрнутого в memo)
 * 7. Не обрабатываются состояния загрузки (isLoading) и ошибки (error)
 */

import { memo, useEffect, useState } from 'react';

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

const PostItem = memo(function PostItem({
  post,
  onSelect,
  isSelected,
}: PostItemProps) {
  return (
    <li className={isSelected ? 'selected' : ''}>
      <button onClick={() => onSelect(post.id)}>{post.title}</button>
      <button onClick={() => onSelect(post.id)}>{post.body}</button>
    </li>
  );
});
PostItem.displayName = 'PostItem';

type Props = {
  userId: number;
};

export function UserPostsList({ userId }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      .then((response) => response.json())
      .then((data: Post[]) => {
        setPosts(data);
        setIsLoading(false);
      });
  }, [userId]);

  const visiblePosts = posts
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter((post) => post.title.toLowerCase().includes(filter.toLowerCase()));

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  useEffect(() => {
    setInterval(() => {
      console.log(`Active posts for user ${userId}: ${posts.length}`);
    }, 3000);
  }, [userId, posts.length]);

  return (
    <div>
      <input
        type="search"
        placeholder="Filter by title"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
      <ul>
        {visiblePosts.map((post, index) => (
          <PostItem
            key={index}
            post={post}
            onSelect={handleSelect}
            isSelected={selectedId === post.id}
          />
        ))}
      </ul>
      {visiblePosts.length === 0 && <p>No posts found</p>}
    </div>
  );
}

export default function App() {
  return <UserPostsList userId={1} />;
}