/* Что проверяет: Понимание того, что сетевые запросы могут выполняться разное время, и их порядок завершения 
не гарантирован. Умение предотвращать обновление стейта неактуальными данными.
*/

/* В чем подвох: Пользователь быстро кликает по списку профилей (ID: 1, затем 2, затем 3). Улетают три запроса. 
Но сервер ответил на запрос с ID=3 быстро, а запрос с ID=1 «завис» и пришел последним. 
В итоге выбран профиль 3, а на экране отобразились данные профиля 1. */

import React, { useState, useEffect } from 'react';

export default function UserProfile({ userId }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ❌ ОШИБКА: Нет проверки актуальности запроса (Race Condition)
  useEffect(() => {
    setLoading(true);

    const fetchUserData = async () => {
      try {
        const res = await fetch(`https://api.example.com/users/${userId}`);
        const data = await res.json();
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <div>Загрузка...</div>;
  if (!userData) return null;

  return <div>Привет, {userData.name}!</div>;
}