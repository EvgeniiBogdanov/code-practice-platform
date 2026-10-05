import React, { useCallback, useEffect, useRef, useState } from 'react';

const PAGE_SIZE = 10;

const InfinitePosts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);
  // Ref, а не state: флаг нужен синхронно и не должен вызывать рендер
  const isLoadingRef = useRef(false);

  const loadPage = useCallback(async (pageToLoad) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageToLoad}&_limit=${PAGE_SIZE}`
      );
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      const data = await res.json();

      setPosts((prev) => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
      setPage(pageToLoad + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasMore || error) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // Маячок попал в видимую область контейнера — грузим следующую страницу
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadPage(page);
      },
      { root: containerRef.current }
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [page, hasMore, error, loadPage]);

  return (
    <div ref={containerRef} style={{ height: 300, overflowY: 'auto' }}>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.id}. {post.title}
          </li>
        ))}
      </ul>

      {isLoading && <p>Загрузка...</p>}
      {error && (
        <p>
          {error} <button onClick={() => loadPage(page)}>Повторить</button>
        </p>
      )}
      {!hasMore && <p>Больше постов нет</p>}
      {hasMore && !error && <div ref={sentinelRef} style={{ height: 1 }} />}
    </div>
  );
};

export default InfinitePosts;
