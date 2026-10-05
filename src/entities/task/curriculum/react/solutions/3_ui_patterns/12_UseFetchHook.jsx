import React, { useEffect, useState } from 'react';

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Счётчик перезапросов: его смена перезапускает эффект без смены url
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setData(await res.json());
      } catch (err) {
        // Отменённый запрос — штатная ситуация, а не ошибка для пользователя
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    load();
    // Смена url или размонтирование отменяет текущий запрос
    return () => controller.abort();
  }, [url, reloadKey]);

  const refetch = () => setReloadKey((key) => key + 1);

  return { data, error, isLoading, refetch };
};

const UserProfile = () => {
  const [userId, setUserId] = useState(1);
  const { data, error, isLoading, refetch } = useFetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  return (
    <div>
      <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((id) => (
          <option key={id} value={id}>
            Пользователь {id}
          </option>
        ))}
      </select>
      <button onClick={refetch}>Обновить</button>

      {isLoading && <p>Загрузка...</p>}
      {error && <p>Ошибка: {error}</p>}
      {data && (
        <p>
          {data.name} — {data.email}
        </p>
      )}
    </div>
  );
};

export default UserProfile;
