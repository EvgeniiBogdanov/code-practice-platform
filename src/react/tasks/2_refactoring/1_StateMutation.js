// В чем подвох: Кажется, что мы обновляем состояние, но React почему-то не перерисовывает компонент, 
// или перерисовывает его с багами.

import React, { useState } from 'react';

export default function UserProfile() {
  const [user, setUser] = useState({
    name: 'Алексей',
    role: 'Admin',
    settings: { theme: 'dark', notifications: true }
  });

  const disableNotifications = () => {
    // ❌ ОШИБКА ЗДЕСЬ
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