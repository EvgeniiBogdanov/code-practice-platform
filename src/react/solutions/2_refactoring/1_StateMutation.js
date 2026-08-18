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
