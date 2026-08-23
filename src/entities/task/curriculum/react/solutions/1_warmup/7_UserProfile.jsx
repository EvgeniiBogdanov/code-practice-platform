import { useState } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState({ name: 'Алексей', age: 30 });

  const handleBirthday = () => {
    // Копируем все старые свойства объекта через спред, меняя только нужное поле
    setUser((prevUser) => ({
      ...prevUser,
      age: prevUser.age + 1,
    }));
  };

  return (
    <div>
      <h1>Профиль</h1>
      <p>Имя: {user.name}</p>
      <p>Возраст: {user.age}</p>
      <button onClick={handleBirthday}>Отметить день рождения</button>
    </div>
  );
};

export default UserProfile;
