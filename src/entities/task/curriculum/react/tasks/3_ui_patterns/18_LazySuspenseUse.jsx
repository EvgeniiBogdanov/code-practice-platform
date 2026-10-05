import React, { useEffect, useState } from 'react';

/**
 * Задача: lazy, Suspense и use() в React 19
 *
 * Требования:
 * 1. Тяжёлый компонент Chart должен загружаться только при первом нажатии «Показать график»
 *    (code splitting через React.lazy). Пока он грузится — показывайте «Загрузка графика...».
 *    Загрузку чанка имитирует loadChartModule().
 * 2. Профиль пользователя загружается через fetchProfile(). Вместо useEffect + isLoading
 *    прочитайте промис хуком use() внутри Suspense с fallback «Загрузка профиля...».
 * 3. Промис профиля НЕ должен создаваться заново при каждом рендере
 *    (иначе компонент будет бесконечно приостанавливаться).
 * 4. Ошибку загрузки профиля можно не обрабатывать — это тема задачи про Error Boundary.
 */

const Chart = () => <div>📈 Здесь мог быть ваш тяжёлый график</div>;

// Имитация загрузки отдельного JS-чанка с компонентом
const loadChartModule = () =>
  new Promise((resolve) => setTimeout(() => resolve({ default: Chart }), 1000));

const fetchProfile = () =>
  fetch('https://jsonplaceholder.typicode.com/users/1').then((res) => res.json());

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile().then(setProfile);
  }, []);

  if (!profile) return <p>Загрузка профиля...</p>;
  return <p>{profile.name}</p>;
};

const App = () => {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <Profile />
      <button onClick={() => setShowChart(true)}>Показать график</button>
      {showChart && <Chart />}
    </div>
  );
};

export default App;
