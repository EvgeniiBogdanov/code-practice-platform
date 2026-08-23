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
