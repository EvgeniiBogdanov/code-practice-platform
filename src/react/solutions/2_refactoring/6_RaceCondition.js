import React, { useState, useEffect } from 'react';

export default function UserProfile({ userId }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //  ПРАВИЛЬНО: Флаг актуальности эффекта (защита от Race Condition)
    let ignore = false;
    setLoading(true);

    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://api.example.com/users/${userId}`);
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();

        //  ПРАВИЛЬНО: Обновляем стейт только если ответ пришел от текущего актуального userId
        if (!ignore) {
          setUserData(data);
          setLoading(false);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Ошибка при загрузке профиля:', error);
          setLoading(false);
        }
      }
    };

    fetchUserData();

    // Функция очистки сработает при изменении userId или размонтировании компонента
    return () => {
      ignore = true;
    };
  }, [userId]);

  if (loading) return <div>Загрузка...</div>;
  if (!userData) return null;

  return <div>Привет, {userData.name}!</div>;
}

/*
=== Разбор решения ===
Использование `async/await` совместно с флагом отмены `ignore` (или `AbortController`) — стандарт решения проблем состояния гонки (Race Condition).

Почему этот подход обязателен на собеседовании:
1. **Защита от Race Condition**: Функция очистки `return () => { ignore = true; }` срабатывает при смене `userId`. Если старый асинхронный ответ `async/await` завершится позже нового, проверка `if (!ignore)` отбросит устаревшие данные.
2. **Безопасный асинхронный синтаксис (async/await)**: Линейное чтение ответа без цепочек `.then().then()` с обязательным перехватом ошибок `try/catch`.
*/
