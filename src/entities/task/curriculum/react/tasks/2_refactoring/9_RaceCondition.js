// Проведите рефакторинг компонента UserProfile: при быстрой смене userId
// сетевые запросы могут завершаться не по порядку, отображая неактуальные данные. Устраните эту проблему.

import React, { useState, useEffect } from 'react';

export default function UserProfile({ userId }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

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