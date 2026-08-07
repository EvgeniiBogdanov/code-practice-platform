import React, { useState } from 'react';

export default function UserProfile() {
  const [user, setUser] = useState({
    name: 'Алексей',
    role: 'Admin',
    settings: { theme: 'dark', notifications: true }
  });

  const disableNotifications = () => {
    //  ПРАВИЛЬНО: Создаем новый объект и новую вложенность
    setUser(prevUser => ({
      ...prevUser,
      settings: {
        ...prevUser.settings,
        notifications: false
      }
    }));
  };

  return (
    <div>
      <h2>Профиль: {user.name}</h2>
      <p>Уведомления: {user.settings.notifications ? 'Вкл' : 'Выкл'}</p>
      <button onClick={disableNotifications}>Отключить уведомления</button>
    </div>
  );
}

/*
=== Разбор решения ===
Проблема: В JavaScript объекты передаются по ссылке. Создавая const updatedUser = user, мы не создаем копию, а лишь даем новую ссылку на тот же объект в памяти. Изменяя updatedUser.settings.notifications, мы мутируем оригинальный стейт напрямую. Когда мы вызываем setUser(updatedUser), React видит, что ссылка на объект не изменилась (user === updatedUser), и отменяет рендер, считая, что ничего не поменялось.

Как надо (Рефакторинг): Нужно создать совершенно новый объект, используя spread-оператор (...), причем не только для верхнего уровня, но и для вложенного объекта settings.
*/
