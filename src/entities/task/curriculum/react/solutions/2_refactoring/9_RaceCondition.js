import React, { useState, useEffect } from 'react';

export default function UserProfile({ userId }) {
  const [userData, setUserData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    //  ПРАВИЛЬНО: флаг актуальности этого запуска эффекта
    let ignore = false;
    setStatus('loading');

    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://api.example.com/users/${userId}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        //  ПРАВИЛЬНО: ответ применяется, только если userId не успел смениться
        if (!ignore) {
          setUserData(data);
          setStatus('success');
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
          setStatus('error');
        }
      }
    };

    fetchUserData();

    // Cleanup срабатывает при смене userId и при размонтировании:
    // все ответы «старых» запусков будут проигнорированы
    return () => {
      ignore = true;
    };
  }, [userId]);

  if (status === 'loading') return <div>Загрузка...</div>;
  if (status === 'error') return <div>Ошибка: {error}</div>;

  return <div>Привет, {userData.name}!</div>;
}

// Альтернатива — AbortController: он не только игнорирует, но и отменяет сам запрос.
// const controller = new AbortController();
// fetch(url, { signal: controller.signal });
// return () => controller.abort();
