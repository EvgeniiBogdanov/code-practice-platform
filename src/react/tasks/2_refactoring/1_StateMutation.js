// Проведите рефакторинг компонента: найдите ошибку, из-за которой
// при отключении уведомлений интерфейс не обновляется, и исправьте её.

import React, { useState } from 'react';

export default function UserProfile() {
  const [user, setUser] = useState({
    name: 'Иван',
    settings: {
      notifications: true,
    }
  });

  const disableNotifications = () => {
    const updatedUser = user;
    updatedUser.settings.notifications = false;
    setUser(updatedUser);
  };

  return (
    <div>
      <h2>Профиль: {user.name}</h2>
      <p>Уведомления: {user.settings.notifications ? 'Вкл' : 'Выкл'}</p>
      <button onClick={disableNotifications}>Отключить уведомления</button>
    </div>
  );
}