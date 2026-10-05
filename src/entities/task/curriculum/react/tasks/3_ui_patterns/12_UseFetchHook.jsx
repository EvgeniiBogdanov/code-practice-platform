import React, { useState } from 'react';

/**
 * Задача: Переиспользуемый хук useFetch
 *
 * Требования:
 * 1. useFetch(url) возвращает { data, error, isLoading, refetch }.
 * 2. Запрос выполняется при монтировании и при каждой смене url.
 * 3. Ответ с !res.ok считается ошибкой.
 * 4. При смене url предыдущий запрос отменяется через AbortController:
 *    в состояние никогда не попадают данные от «старого» url (race condition).
 * 5. Отмена запроса не показывается пользователю как ошибка.
 * 6. refetch() повторяет запрос по текущему url.
 * 7. Примените хук: выбор пользователя в <select> загружает его профиль.
 */

export const useFetch = (url) => {
  // Напишите ваш код хука здесь
  return { data: null, error: null, isLoading: false, refetch: () => {} };
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
